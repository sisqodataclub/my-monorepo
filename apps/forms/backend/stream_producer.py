import websocket
import json
import redis
import os
from dotenv import load_dotenv

# Load variables from the .env file
load_dotenv()

# Connect to our new Redis container
r = redis.Redis(host='redis', port=6379, db=0, decode_responses=True)

def on_message(ws, message):
    """Fires every time Finnhub sends us a new price tick."""
    data = json.loads(message)
    
    if data.get('type') == 'trade':
        for trade in data['data']:
            tick = {
                'symbol': trade['s'],   
                'price': trade['p'],    
                'timestamp': trade['t'] 
            }
            
            print(f"⚡ LIVE TICK: {tick['symbol']} @ {tick['price']}")
            
            # PUBLISH directly into Redis RAM
            r.publish('live_prices', json.dumps(tick))

def on_error(ws, error):
    print(f"❌ Error: {error}")

def on_close(ws, close_status_code, close_msg):
    print("🔴 Stream Closed")

def on_open(ws):
    print("🟢 Connected to Finnhub Live Stream!")
    # Subscribe to GBP/USD (Oanda Forex)
    ws.send('{"type":"subscribe","symbol":"OANDA:GBP_USD"}')
    # Subscribe to Bitcoin for high-speed testing ticks
    ws.send('{"type":"subscribe","symbol":"BINANCE:BTCUSDT"}')

if __name__ == "__main__":
    websocket.enableTrace(False)
    
    # Securely grab the API key from the environment
    API_KEY = os.environ.get("FINNHUB_API_KEY")
    
    if not API_KEY:
        print("❌ CRITICAL ERROR: FINNHUB_API_KEY not found in .env file!")
        exit(1)
        
    ws_url = f"wss://ws.finnhub.io?token={API_KEY}"
    
    ws = websocket.WebSocketApp(
        ws_url,
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close
    )
    
    ws.run_forever()
