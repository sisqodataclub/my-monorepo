from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # React will connect to wss://api.franciscodes.com/ws/live-prices/
    re_path(r'ws/live-prices/$', consumers.LivePriceConsumer.as_asgi()),
]
