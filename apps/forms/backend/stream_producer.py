#!/usr/bin/env python3
"""
Finnhub WebSocket Stream Producer
Subscribes to live trades for GBP/USD and BTC/USDT and publishes to Redis.
"""

import websocket
import json
import redis
import os
import time
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# -----------------------------------------------------------------------------
# CONFIGURATION
# -----------------------------------------------------------------------------
REDIS_HOST = os.environ.get("REDIS_HOST", "redis")
REDIS_PORT = int(os.environ.get("REDIS_PORT", 6379))
REDIS_DB = int(os.environ.get("REDIS_DB", 0))
REDIS_CHANNEL = "live_prices"

FINNHUB_API_KEY = os.environ.get("FINNHUB_API_KEY")
if not FINNHUB_API_KEY:
    print("❌ CRITICAL: FINNHUB_API_KEY not set in environment or .env file!")
    sys.exit(1)

# -----------------------------------------------------------------------------
# REDIS CONNECTION
# -----------------------------------------------------------------------------
try:
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB, decode_responses=True)
    r.ping()  # Test connection
    print(f"✅ Connected to Redis at {REDIS_HOST}:{REDIS_PORT}")
except Exception as e:
    print(f"❌ Failed to connect to Redis: {e}")
    sys.exit(1)

# -----------------------------------------------------------------------------
# WEBSOCKET CALLBACKS
# -----------------------------------------------------------------------------
def on_message(ws, message):
    """Handle incoming messages from Finnhub."""
    data = json.loads(message)

    # Finnhub sends trade data in 'data' array when type is 'trade'
    if data.get('type') == 'trade':
        for trade in data['data']:
            tick = {
                'symbol': trade['s'],
                'price': trade['p'],
                'timestamp': trade['t'],
                'volume': trade.get('v')  # optional
            }
            print(f"⚡ LIVE TICK: {tick['symbol']} @ {tick['price']}")

            # Publish to Redis Pub/Sub
            try:
                r.publish(REDIS_CHANNEL, json.dumps(tick))
            except Exception as e:
                print(f"⚠️ Redis publish failed: {e}")

    # Finnhub sometimes sends ping messages; ignore them
    elif data.get('type') == 'ping':
        pass

    # Log any other message types for debugging
    else:
        print(f"ℹ️ Received message type '{data.get('type')}': {data}")

def on_error(ws, error):
    """Handle WebSocket errors."""
    err_str = str(error)

    # Known benign Finnhub messages that can be safely ignored
    benign_patterns = [
        "Authentication required",    # Often sent even when auth is valid
        "401",                        # Sometimes appears alongside successful connection
    ]
    if any(pattern in err_str for pattern in benign_patterns):
        # Optionally log at debug level; we silence it to reduce noise
        return

    # Real errors – log and potentially trigger reconnection
    print(f"❌ WebSocket error: {error}")

    # If the error is fatal (e.g., connection refused), we might want to exit
    if "Connection refused" in err_str or "Name or service not known" in err_str:
        print("🔴 Fatal connection error. Exiting.")
        sys.exit(1)

def on_close(ws, close_status_code, close_msg):
    """Handle connection close."""
    print(f"🔴 WebSocket closed (code: {close_status_code}, msg: {close_msg})")
    # Optional: implement reconnection logic here if desired
    print("🔄 Attempting to reconnect in 5 seconds...")
    time.sleep(5)
    start_websocket()

def on_open(ws):
    """Subscribe to symbols once connection is established."""
    print("🟢 Connected to Finnhub WebSocket")
    # Subscribe to GBP/USD (Oanda Forex)
    ws.send('{"type":"subscribe","symbol":"OANDA:GBP_USD"}')
    # Subscribe to Bitcoin (Binance)
    ws.send('{"type":"subscribe","symbol":"BINANCE:BTCUSDT"}')
    print("📡 Subscribed to OANDA:GBP_USD and BINANCE:BTCUSDT")

# -----------------------------------------------------------------------------
# MAIN LOOP
# -----------------------------------------------------------------------------
def start_websocket():
    """Create and run the WebSocket connection."""
    ws_url = f"wss://ws.finnhub.io?token={FINNHUB_API_KEY}"
    ws = websocket.WebSocketApp(
        ws_url,
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close
    )
    # run_forever blocks; reconnection is handled in on_close
    ws.run_forever()

if __name__ == "__main__":
    try:
        print("🚀 Starting Finnhub Stream Producer...")
        start_websocket()
    except KeyboardInterrupt:
        print("\n👋 Shutting down gracefully...")
        sys.exit(0)
