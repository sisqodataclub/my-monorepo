"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""


import os
from django.core.asgi import get_asgi_application

# Set the default settings module before importing anything else
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Initialize standard Django ASGI application early to ensure AppRegistry is populated
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import api.routing

application = ProtocolTypeRouter({
    # Standard HTTP requests get routed to Django normally
    "http": django_asgi_app,
    
    # WebSocket requests get routed through our new routing.py
    "websocket": AuthMiddlewareStack(
        URLRouter(
            api.routing.websocket_urlpatterns
        )
    ),
})
