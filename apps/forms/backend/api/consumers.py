import json
import asyncio
import redis.asyncio as redis
from channels.generic.websocket import AsyncWebsocketConsumer
import os

class LivePriceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # 1. Accept the incoming WebSocket connection from React
        await self.accept()
        
        # 2. Connect to the exact same Redis container the producer is writing to
        redis_host = os.getenv("REDIS_HOST", "franciscodes-redis")
        self.redis_client = redis.Redis(host=redis_host, port=6379, db=0, decode_responses=True)
        self.pubsub = self.redis_client.pubsub()
        
        # 3. Subscribe to the 'live_prices' channel
        await self.pubsub.subscribe('live_prices')
        
        # 4. Start a background task that listens forever
        self.listen_task = asyncio.create_task(self.listen_to_redis())
        print("🟢 WebSocket Connected & Listening to Redis!")

    async def disconnect(self, close_code):
        # Clean up when the user closes the browser tab
        self.listen_task.cancel()
        await self.pubsub.unsubscribe('live_prices')
        await self.redis_client.aclose()
        print("🔴 WebSocket Disconnected")

    async def listen_to_redis(self):
        """Continuously pulls messages from Redis and sends them down the WebSocket."""
        try:
            async for message in self.pubsub.listen():
                if message['type'] == 'message':
                    # message['data'] contains the JSON string from our Producer
                    await self.send(text_data=message['data'])
        except asyncio.CancelledError:
            pass
