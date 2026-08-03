from rest_framework import serializers

from Gamme.models import MissionControle, User, epi, moyens_controle


class MissionListSerializer(serializers.ModelSerializer):
    statut_label = serializers.SerializerMethodField()
    has_pdf = serializers.SerializerMethodField()
    pdf_url = serializers.SerializerMethodField()

    class Meta:
        model = MissionControle
        fields = [
            'id',
            'code',
            'intitule',
            'reference',
            'description',
            'statut',
            'statut_label',
            'date_creation',
            'client',
            'designation',
            'has_pdf',
            'pdf_url',
        ]

    def get_statut_label(self, obj):
        return 'Actif' if obj.statut else 'Inactif'

    def get_has_pdf(self, obj):
        return bool(obj.pdf_file)

    def get_pdf_url(self, obj):
        if not obj.pdf_file:
            return None

        request = self.context.get('request')
        url = obj.pdf_file.url
        return request.build_absolute_uri(url) if request else url


class MissionDetailSerializer(MissionListSerializer):
    gammes_count = serializers.IntegerField(source='gammes.count', read_only=True)

    class Meta(MissionListSerializer.Meta):
        fields = MissionListSerializer.Meta.fields + [
            'section',
            'gammes_count',
            'date_mise_a_jour',
        ]


class MissionWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MissionControle
        fields = [
            'code',
            'intitule',
            'description',
            'reference',
            'statut',
            'section',
            'client',
            'designation',
        ]

    def validate_code(self, value):
        instance = self.instance
        qs = MissionControle.objects.filter(code=value)
        if instance:
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise serializers.ValidationError('Ce code existe deja.')
        return value

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['updated_by'] = self.context['request'].user
        return super().update(instance, validated_data)


class CurrentUserSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()
    default_role = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    role_label = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'is_superuser',
            'is_admin',
            'is_op',
            'is_rs',
            'is_ro',
            'display_name',
            'roles',
            'default_role',
            'role_label',
        ]

    def get_roles(self, obj):
        roles = []
        if obj.is_superuser or obj.is_admin:
            roles.append('admin')
        if obj.is_rs:
            roles.append('responsable')
        if obj.is_ro:
            roles.append('ro')
        if obj.is_op:
            roles.append('operateur')
        return roles

    def get_default_role(self, obj):
        roles = self.get_roles(obj)
        return roles[0] if roles else None

    def get_role_label(self, obj):
        if obj.is_superuser or obj.is_admin:
            return 'Admin'
        if obj.is_rs:
            return 'Responsable'
        if obj.is_ro:
            return 'RO'
        if obj.is_op:
            return 'Operateur'
        return 'Compte'

    def get_display_name(self, obj):
        full_name = obj.get_full_name().strip()
        return full_name or obj.username


class UserListSerializer(serializers.ModelSerializer):
    role_label = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'is_superuser',
            'is_admin',
            'is_op',
            'is_rs',
            'is_ro',
            'role_label',
        ]

    def get_role_label(self, obj):
        if obj.is_superuser or obj.is_admin:
            return 'Admin'
        if obj.is_rs:
            return 'Responsable'
        if obj.is_ro:
            return 'RO'
        if obj.is_op:
            return 'Operateur'
        return 'Compte'


class UserWriteSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    role = serializers.ChoiceField(
        choices=[('admin', 'Admin'), ('rs', 'Responsable'), ('ro', 'RO'), ('op', 'Operateur')],
        write_only=True,
        required=False,
    )

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'password',
            'role',
        ]

    def _apply_role(self, user, role):
        user.is_admin = False
        user.is_op = False
        user.is_rs = False
        user.is_ro = False
        if role == 'admin':
            user.is_admin = True
        elif role == 'rs':
            user.is_rs = True
        elif role == 'ro':
            user.is_ro = True
        elif role == 'op':
            user.is_op = True

    def create(self, validated_data):
        role = validated_data.pop('role', 'op')
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        self._apply_role(user, role)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        role = validated_data.pop('role', None)
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if role is not None:
            self._apply_role(instance, role)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class EpiSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = epi
        fields = ['id', 'nom', 'photo', 'photo_url', 'commentaire']

    def get_photo_url(self, obj):
        if not obj.photo:
            return None
        request = self.context.get('request')
        url = obj.photo.url
        return request.build_absolute_uri(url) if request else url


class MoyenControleSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = moyens_controle
        fields = ['id', 'nom', 'photo', 'photo_url', 'ordre']

    def get_photo_url(self, obj):
        if not obj.photo:
            return None
        request = self.context.get('request')
        url = obj.photo.url
        return request.build_absolute_uri(url) if request else url
