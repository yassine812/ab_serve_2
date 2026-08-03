from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from .views import CurrentUserView, MissionViewSet, UserViewSet, EpiViewSet, MoyenControleViewSet


router = DefaultRouter()
router.register('missions', MissionViewSet, basename='mission')
router.register('users', UserViewSet, basename='user')
router.register('epi', EpiViewSet, basename='epi')
router.register('moyens-controle', MoyenControleViewSet, basename='moyen-controle')

urlpatterns = [
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('auth/me/', CurrentUserView.as_view(), name='auth_me'),
    path('', include(router.urls)),
]
