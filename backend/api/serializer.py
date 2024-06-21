from .models import User, Profile, Type, Brand, Device, Rating, Comment, Basket, BasketDevice, Order, OrderDevice, \
    TypeOrder, Status, PickupOrder, DeliveryOrder, Wallet, Attendance, Characteristic, DeviceCharacteristic, \
    PickupOrder, Accounting, UserLogin
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import ValidationError


# Сериализатор для модели User
class UserSerializer(serializers.ModelSerializer):
    # Определение сериализатора для модели User
    class Meta:
        model = User  # Указываем, что сериализатор будет работать с моделью User
        fields = ['id', 'username', 'email']  # Указываем поля модели, которые будут сериализованы


# Для получения токена
class UserToken(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role

        # Проверяем наличие профиля пользователя
        if hasattr(user, 'profile'):
            token['first_name'] = user.profile.first_name
            token['surname'] = user.profile.surname
            token['patronymic'] = user.profile.patronymic
            token['phone_number'] = user.profile.phone_number
            token['image'] = str(user.profile.image)

        UserLogin.objects.create(user=user)

        return token  # Возвращаем обновленный токен с дополнительными данными о пользователе


class RegisterSerializer(serializers.ModelSerializer):
    # Добавляем поля для пароля и его подтверждения
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        # Указываем поля, которые будут сериализованы
        fields = ['email', 'username', 'password', 'password2']

    # Проверка, что пароль и его подтверждение совпадают
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            # Если пароли не совпадают, вызываем исключение
            raise serializers.ValidationError(
                {'password': 'Поля паролей не совпадают'}
            )
        return attrs

    # Создание пользователя с использованием введенных данных
    def create(self, validated_data):
        # Создаем пользователя с указанными данными
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        # Устанавливаем пароль для пользователя
        user.set_password(validated_data['password'])
        user.save()

        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Пароли не совпадают."})
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError({"old_password": "Старый пароль неверный."})
        return value

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'first_name', 'surname', 'patronymic', 'phone_number', 'image']

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance

class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'


class DeviceWithoutRatingSerializer(serializers.ModelSerializer):
    brand = serializers.SlugRelatedField(slug_field='name', queryset=Brand.objects.all())
    type = serializers.SlugRelatedField(slug_field='name', queryset=Type.objects.all())

    class Meta:
        model = Device
        fields = ['id', 'name_device', 'brand', 'type', 'price', 'image_device', 'info']

class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Characteristic
        fields = '__all__'

class CharacterDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceCharacteristic
        fields = '__all__'

class DeviceWithRatingSerializer(serializers.ModelSerializer):
    rating_device = serializers.SerializerMethodField()
    brand = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    status_accounting = serializers.SerializerMethodField()
    characteristics = serializers.SerializerMethodField()

    class Meta:
        model = Device
        fields = ['id', 'name_device', 'brand', 'type', 'price', 'image_device', 'info', 'rating_device', 'quantity',
                  'status_accounting', 'characteristics']

    def get_status_accounting(self, obj):
        try:
            accounting = Accounting.objects.get(device=obj)
            return {
                'status': accounting.status,
                'quantity': accounting.quantity
            }
        except Accounting.DoesNotExist:
            return {
                'status': None
            }

    def get_rating_device(self, obj):
        try:
            rating = Rating.objects.get(device_id=obj)
            return {
                'mean_rating': rating.mean_rating,
                'count_feedbacks': rating.count_feedbacks
            }
        except Rating.DoesNotExist:
            return {
                'mean_rating': None,
                'count_feedbacks': 0
            }

    def get_brand(self, obj):
        return {
            'name': obj.brand.name,
            'image': str(obj.brand.logo_brand)
        }

    def get_type(self, obj):
        return obj.type.name

    def get_characteristics(self, obj):
        characteristics = Characteristic.objects.filter(type=obj.type)
        device_characteristics = DeviceCharacteristic.objects.filter(device=obj)

        result = []
        for char in characteristics:
            device_char = next((dc for dc in device_characteristics if dc.characteristic == char), None)
            result.append({
                'name': char.name,
                'value': device_char.value if device_char else ''
            })

        return result

    def get_image_device(self, obj):
        if obj.image_device:
            image_url = str(obj.image_device.url)
            return image_url.replace("/media/", "/api/media/")
        return None

class DevicePriceUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['price']



class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'device', 'user', 'comment_text', 'rating']
        extra_kwargs = {'device': {'read_only': True}, 'user': {'read_only': True}}

    def create(self, validated_data):
        request = self.context.get('request')
        device_id = self.context.get('view').kwargs.get('pk')

        if not device_id:
            raise ValidationError("Device ID is required.")

        return super().create(validated_data)



class CommentsGetDeviceSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(source='user.profile')
    class Meta:
        model = Comment
        fields = ['id', 'device', 'user', 'comment_text', 'rating']


class BasketDeviceSerializer(serializers.ModelSerializer):
    device_id = serializers.PrimaryKeyRelatedField(
        queryset=Device.objects.all(),
        source='device',
        write_only=True
    )
    device = DeviceWithRatingSerializer(read_only=True)

    class Meta:
        model = BasketDevice
        fields = ['id', 'basket', 'device_id', 'quantity', 'device']

    def delete(self, instance):
        instance.delete()


class BasketDeviceUpdateSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['increase', 'decrease'])

    def update(self, instance, validated_data):
        action = validated_data['action']
        if action == 'increase':
            instance.quantity += 1
        elif action == 'decrease':
            if instance.quantity > 0:
                instance.quantity -= 1
        instance.save()
        return instance


# order
class OrderDeviceSerializer(serializers.ModelSerializer):
    device_id = serializers.PrimaryKeyRelatedField(
        queryset=Device.objects.all(),
        source='device',
        write_only=True
    )
    device = DeviceWithRatingSerializer(read_only=True)

    class Meta:
        model = OrderDevice
        fields = ['id', 'device_id', 'quantity', 'device']


class OrderDeliveryInfo(serializers.ModelSerializer):
    date_delivery = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    comments = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    class Meta:
        model = DeliveryOrder
        fields = ['name_user', 'telephone', 'address', 'entrance', 'flat', 'comments', 'date_delivery']


class OrderPickup(serializers.ModelSerializer):
    date_pickup = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    class Meta:
        model = PickupOrder
        fields = ['name_user', 'telephone', 'date_pickup']


class TypeOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeOrder
        fields = '__all__'


class StatusOrder(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = '__all__'


# Для всех orders
class OrderAllSerializer(serializers.ModelSerializer):
    date_order = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    order_devices = OrderDeviceSerializer(many=True)
    delivery_order = OrderDeliveryInfo(required=False)
    pickup_order = OrderPickup(required=False)
    type_order = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    def get_type_order(self, obj):
        return obj.type_order.type_name

    def get_status(self, obj):
        return obj.status.description

    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'type_order', 'date_order', 'payment_method', 'total_amount', 'number_order',
                  'order_devices', 'delivery_order', 'pickup_order']
#Для пользователя
class OrderUserSerializer(serializers.ModelSerializer):
    date_order = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    order_devices = OrderDeviceSerializer(many=True)
    delivery_order = OrderDeliveryInfo(required=False)
    pickup_order = OrderPickup(required=False)
    type_order = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    def get_type_order(self, obj):
        return obj.type_order.type_name

    def get_status(self, obj):
        return obj.status.description

    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'type_order', 'date_order', 'payment_method', 'total_amount', 'number_order',
                  'order_devices', 'delivery_order', 'pickup_order']


#для order/pk/delivery
class OrderUserSerializerDelivery(serializers.ModelSerializer):
    date_order = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    order_devices = OrderDeviceSerializer(many=True)
    delivery_order = OrderDeliveryInfo()
    status = serializers.PrimaryKeyRelatedField(queryset=Status.objects.all())

    def get_status(self, obj):
        return obj.status.description

    class Meta:
        model = Order
        fields = ['user', 'status', 'type_order', 'date_order', 'payment_method', 'total_amount', 'number_order',
                  'order_devices', 'delivery_order']


    def create(self, validated_data):
        order_devices_data = validated_data.pop('order_devices')
        delivery_order_data = validated_data.pop('delivery_order')
        status_data = validated_data.pop('status')
        validated_data.pop('number_order', None)

        order = Order.objects.create(status=status_data, **validated_data)

        for order_device_data in order_devices_data:
            device_instance = order_device_data['device']
            quantity_ordered = order_device_data['quantity']

            # Обновление количества устройств в модели Accounting
            accounting_instance = Accounting.objects.get(device=device_instance)
            accounting_instance.quantity -= quantity_ordered
            accounting_instance.save()

            OrderDevice.objects.create(order=order, **order_device_data)

        DeliveryOrder.objects.create(order=order, **delivery_order_data)

        return order

#для order/pk/pickup
class OrderUserSerializerPickup(serializers.ModelSerializer):
    date_order = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    order_devices = OrderDeviceSerializer(many=True)
    pickup_order = OrderPickup()
    status = serializers.PrimaryKeyRelatedField(queryset=Status.objects.all())

    def get_status(self, obj):
        return obj.status.description

    class Meta:
        model = Order
        fields = ['user', 'status', 'type_order', 'date_order', 'payment_method', 'total_amount', 'number_order',
                  'order_devices', 'pickup_order']


    def create(self, validated_data):
        order_devices_data = validated_data.pop('order_devices')
        pickup_order_data = validated_data.pop('pickup_order')
        status_data = validated_data.pop('status')
        validated_data.pop('number_order', None)

        order = Order.objects.create(status=status_data, **validated_data)

        for order_device_data in order_devices_data:
            device_instance = order_device_data['device']
            quantity_ordered = order_device_data['quantity']

            # Обновление количества устройств в модели Accounting
            accounting_instance = Accounting.objects.get(device=device_instance)
            accounting_instance.quantity -= quantity_ordered
            accounting_instance.save()

            OrderDevice.objects.create(order=order, **order_device_data)

        PickupOrder.objects.create(order=order, **pickup_order_data)

        return order


class GetLastNumberOrder(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['number_order']


class GetAllUserOrder(serializers.ModelSerializer):
    date_order = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    order_devices = OrderDeviceSerializer(many=True)
    delivery_order = OrderDeliveryInfo()
    type_order = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    def get_type_order(self, obj):
        return obj.type_order.type_name

    def get_status(self, obj):
        return obj.status.description

    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'type_order', 'date_order', 'payment_method', 'total_amount', 'number_order',
                  'order_devices', 'delivery_order']
        #fields = '__all__'


# кошелек
class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = '__all__'


class WalletTopUpSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)

    def validated_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Сумма должна быть больше нуля')
        return value


class OrderPaymentSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Сумма должна быть больше нуля")
        return value


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = '__all__'


class StatusChangeOrderSerializer(serializers.Serializer):
    date = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', required=False)
    status = serializers.CharField(required=False)


class OrderDeliveriedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class AttendanceSerializer(serializers.ModelSerializer):
    count_user = serializers.SerializerMethodField()

    def get_count_user(self, obj):
        return UserLogin.objects.count()

    class Meta:
        model = Attendance
        fields = ['month', 'count', 'count_user']


class AccountingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accounting
        fields = ['device', 'quantity', 'status']



class SalesForecastSerializer(serializers.Serializer):
    sales_dates = serializers.ListField(child=serializers.DateField())
    actual_sales = serializers.ListField(child=serializers.DecimalField(max_digits=10, decimal_places=2))
    forecast_dates = serializers.ListField(child=serializers.DateField())
    forecasted_sales = serializers.ListField(child=serializers.DecimalField(max_digits=10, decimal_places=2))
    future_forecast_dates = serializers.ListField(child=serializers.DateField())
    future_forecasted_sales = serializers.ListField(child=serializers.DecimalField(max_digits=10, decimal_places=2))



