from django.db.models import Q
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from Gamme.models import MissionControle, User, epi, moyens_controle
from .serializers import (
    CurrentUserSerializer,
    MissionDetailSerializer,
    MissionListSerializer,
    MissionWriteSerializer,
    UserListSerializer,
    UserWriteSerializer,
    EpiSerializer,
    MoyenControleSerializer,
)
from .pagination import MissionPagination


TRUTHY_VALUES = {'1', 'true', 'yes', 'active', 'actif'}
FALSY_VALUES = {'0', 'false', 'no', 'inactive', 'inactif'}


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = CurrentUserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = CurrentUserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = request.user
        for field in ('first_name', 'last_name', 'email'):
            if field in serializer.validated_data:
                setattr(user, field, serializer.validated_data[field])
        user.save()
        return Response(CurrentUserSerializer(user).data)


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_authenticated and (
            request.user.is_superuser or request.user.is_admin
        )


class MissionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
    pagination_class = MissionPagination

    def get_queryset(self):
        queryset = MissionControle.objects.all().prefetch_related('gammes')

        mine = self.request.query_params.get('mine')
        if self.request.user.is_op or (mine and mine.lower() in TRUTHY_VALUES):
            queryset = queryset.filter(statut=True)
        else:
            statut = self.request.query_params.get('statut')
            if statut:
                statut_value = statut.lower()
                if statut_value in TRUTHY_VALUES:
                    queryset = queryset.filter(statut=True)
                elif statut_value in FALSY_VALUES:
                    queryset = queryset.filter(statut=False)

        reference = self.request.query_params.get('reference')
        if reference:
            queryset = queryset.filter(reference__iexact=reference)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(code__icontains=search)
                | Q(intitule__icontains=search)
                | Q(reference__icontains=search)
                | Q(description__icontains=search)
            )

        ordering = self.request.query_params.get('ordering', '-date_creation')
        allowed_ordering = {'date_creation', '-date_creation', 'code', '-code', 'intitule', '-intitule'}
        if ordering not in allowed_ordering:
            ordering = '-date_creation'

        return queryset.order_by(ordering)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return MissionDetailSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return MissionWriteSerializer
        return MissionListSerializer

    @action(detail=False, methods=['get'])
    def meta(self, request):
        queryset = self.get_queryset()
        references = sorted(
            [value for value in queryset.values_list('reference', flat=True).distinct() if value and value.strip()]
        )

        return Response(
            {
                'counts': {
                    'total': queryset.count(),
                    'active': queryset.filter(statut=True).count(),
                    'inactive': queryset.filter(statut=False).count(),
                },
                'references': references,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=['post'], url_path='generate-pdf')
    def generate_pdf(self, request, pk=None):
        mission = self.get_object()
        return Response(
            {'message': 'PDF generation triggered', 'mission_id': mission.id},
            status=status.HTTP_200_OK,
        )


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

    def get_queryset(self):
        return User.objects.filter(
            Q(is_op=True) | Q(is_rs=True) | Q(is_ro=True) | Q(is_admin=True) | Q(is_superuser=True)
        ).order_by('username')

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return UserWriteSerializer
        return UserListSerializer


class EpiViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
    queryset = epi.objects.all().order_by('nom')
    serializer_class = EpiSerializer


class MoyenControleViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
    queryset = moyens_controle.objects.all().order_by('ordre', 'nom')
    serializer_class = MoyenControleSerializer
