import os

from django.core.wsgi import get_wsgi_application

# Vercel's Python runtime expects a top-level WSGI callable named `app`.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ab_serve.settings")
app = get_wsgi_application()

