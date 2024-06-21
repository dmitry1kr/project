from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from django.db.models import Max
from datetime import datetime
import math

from .models import *
from .serializer import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db import IntegrityError
from django.db.models import Sum
from django.db.models.functions import TruncDate
from sklearn.linear_model import LinearRegression
import numpy as np
from datetime import timedelta
from rest_framework.views import APIView


class UserTokenView(TokenObtainPairView):
    serializer_class = UserToken


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Проверяем старый пароль
            if not self.object.check_password(serializer.validated_data['old_password']):
                return Response({"old_password": ["Неверный пароль."]}, status=status.HTTP_400_BAD_REQUEST)

            # Устанавливаем новый пароль
            self.object.set_password(serializer.validated_data['new_password'])
            self.object.save()

            return Response({"detail": "Пароль успешно изменен."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def dashboards(request):
    if request.method == 'GET':
        context = f'Пользователь {request.user}, зашел в сеть'
        return Response({'response': context}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        text = request.POST.get('text')
        response = f'Пользователь {request}, твой текст {text}'
        return Response({'response': response}, status=status.HTTP_200_OK)
    else:
        context = f'Не авторизован'
        return Response({'response': context}, status=status.HTTP_200_OK)


class ProfileView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProfileSerializer

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Profile.objects.filter(user=user_id)

class TypeListCreate(generics.ListCreateAPIView):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer


class BrandListCreate(generics.ListCreateAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer


class DeviceListCreateAPIView(generics.ListCreateAPIView):
    queryset = Device.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DeviceWithoutRatingSerializer
        return DeviceWithRatingSerializer


class DeviceRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Device.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'PUT' or self.request.method == 'PATCH':
            return DevicePriceUpdateSerializer
        return DeviceWithRatingSerializer


class CharacterView(generics.ListCreateAPIView):
    queryset = Characteristic.objects.all()
    serializer_class = CharacterSerializer

class CharacterDeviceView(APIView):

    def post(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            responses = []
            for item in request.data:
                device_id = item.get('device')
                characteristic_name = item.get('characteristic')
                value = item.get('value')

                try:
                    device = Device.objects.get(id=device_id)
                    characteristic = Characteristic.objects.get(name=characteristic_name)

                    new_characteristic = DeviceCharacteristic.objects.create(
                        device=device,
                        characteristic=characteristic,
                        value=value
                    )

                    serializer = CharacterDeviceSerializer(new_characteristic)
                    responses.append(serializer.data)
                except Exception as e:
                    return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

            return Response(responses, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "Invalid data format. Expected a list."}, status=status.HTTP_400_BAD_REQUEST)


class CommentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CommentsGetDeviceSerializer

    def get_queryset(self):
        device_id = self.kwargs['pk']
        return Comment.objects.filter(device=device_id)



class CommentRetrieveUpdateDestroyAPIView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        device_id = self.kwargs['pk']
        return Comment.objects.filter(device=device_id)

    def perform_create(self, serializer):
        device_id = self.kwargs['pk']
        user = self.request.user

        try:
            device = Device.objects.get(pk=device_id)
        except Device.DoesNotExist:
            raise ValidationError("Устройство не найден.")

        if Comment.objects.filter(device=device, user=user).exists():
            raise ValidationError("Вы уже оставляли коментарий.")

        serializer.save(device=device, user=user)


class BasketDeviceView(generics.ListCreateAPIView):
    serializer_class = BasketDeviceSerializer

    def get_queryset(self):
        basket_id = self.kwargs['user_id']
        return BasketDevice.objects.filter(basket=basket_id)

    def post(self, request, *args, **kwargs):
        basket_id = self.kwargs['user_id']
        basket = BasketDevice.objects.filter(basket=basket_id)
        device_id = request.data.get('device_id')

        if basket.filter(device_id=device_id).exists():
            return Response({'error': 'Устройство уже в корзине'})

        try:
            return super().post(request, *args, **kwargs)
        except ValidationError as e:
            return Response({"error": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError as e:
            return Response({"error": "IntegrityError: {}".format(str(e))}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        device_id = kwargs.get('device_id')
        if device_id is not None:
            try:
                basket_id = self.kwargs['user_id']
                basket = BasketDevice.objects.filter(basket=basket_id)
                instance = basket.get(device_id=device_id)
                instance.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            except BasketDevice.DoesNotExist:
                return Response({"error": "Устройство не найдено в корзине."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Device ID is required."}, status=status.HTTP_400_BAD_REQUEST)


class BasketDeviceViewDeleteAll(generics.ListCreateAPIView):
    def delete(self, request, *args, **kwargs):
        basket_id = self.kwargs['user_id']
        basket = BasketDevice.objects.filter(basket=basket_id)

        try:
            basket.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': f'FОшибка при удалении: {e, status.HTTP_500_INTERNAL_SERVER_ERROR}'})


class UpdateBasketDeviceQuantity(APIView):
    def patch(self, request, pk):
        try:
            basket_device = BasketDevice.objects.get(pk=pk)
        except BasketDevice.DoesNotExist:
            return Response({'error': 'Корзина не найдена'}, status=status.HTTP_404_NOT_FOUND)

        serializer = BasketDeviceUpdateSerializer(data=request.data)
        if serializer.is_valid():
            updated_instance = serializer.update(basket_device, serializer.validated_data)
            response_serializer = BasketDeviceSerializer(updated_instance)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderListCreateAPIView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderAllSerializer


class Test(generics.ListCreateAPIView):
    queryset = DeliveryOrder.objects.all()
    serializer_class = OrderDeliveryInfo


class OrderRetrieveUpdateDestroyAPIView(generics.ListCreateAPIView):
    serializer_class = OrderUserSerializer

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Order.objects.filter(user=user_id)


#Для delivery
class OrderDeliveryView(generics.ListCreateAPIView):
    serializer_class = OrderUserSerializerDelivery

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Order.objects.filter(user=user_id)

#Для pickup
class OrderPickupView(generics.ListCreateAPIView):
    serializer_class = OrderUserSerializerPickup

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Order.objects.filter(user=user_id)



class OrderLastNumberView(generics.ListCreateAPIView):
    serializer_class = GetLastNumberOrder

    def get_queryset(self):
        last_order_id = Order.objects.aggregate(Max('id'))['id__max']
        return Order.objects.filter(id=last_order_id)

class OrderAllUser(generics.ListCreateAPIView):
    serializer_class = GetAllUserOrder
    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Order.objects.filter(user=user_id)


class OrderUserNotPayed(generics.ListCreateAPIView):
    serializer_class = OrderUserSerializer

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Order.objects.filter(user=user_id, status=2)


class UserWalletView(generics.ListCreateAPIView):
    serializer_class = WalletSerializer

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Wallet.objects.filter(user=user_id)


class WalletTopUpView(APIView):
    def post(self, request, pk, format=None):
        wallet = Wallet.objects.get(user_id=pk)
        serializer = WalletTopUpSerializer(data=request.data)

        if serializer.is_valid():
            amount = serializer.validated_data['amount']
            wallet.balance += amount
            wallet.save()

            return Response({'balance': wallet.balance}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderPaymentView(APIView):
    def post(self, request, pk, format=None):
        wallet = Wallet.objects.get(user_id=pk)
        serializer = OrderPaymentSerializer(data=request.data)

        if serializer.is_valid():
            order_id = serializer.validated_data['order_id']
            amount = serializer.validated_data['amount']

            order = Order.objects.get(id=order_id, user_id=pk, status=2)  # статус 2 - не оплачен

            if wallet.balance >= amount:
                wallet.balance -= amount
                wallet.save()

                order.status = Status.objects.get(id=1)
                order.save()

                return Response({'detail': 'Оплата прошла успешно'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Недостаточно средств на балансе'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetStatusView(generics.ListCreateAPIView):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer


class StatusChangeView(APIView):
    def post(self, request, pk, format=None):
        try:
            order = Order.objects.get(id=pk)
        except Order.DoesNotExist:
            return Response({'error': 'Заказ не найден'}, status=status.HTTP_404_NOT_FOUND)

        serializer = StatusChangeOrderSerializer(data=request.data)
        if serializer.is_valid():
            status_description = serializer.validated_data.get('status')
            date_order = serializer.validated_data.get('date')
            type_order = order.type_order

            if status_description:
                try:
                    new_status = Status.objects.get(description=status_description)
                except Status.DoesNotExist:
                    return Response({'error': 'Неверный статус'}, status=status.HTTP_400_BAD_REQUEST)

                order.status = new_status
                order.save()

            if date_order:
                if type_order.type_name == 'Доставка':
                    DeliveryOrder.objects.update_or_create(
                        order=order,
                        defaults={'date_delivery': date_order}
                    )
                elif type_order.type_name == 'Самовывоз':
                    print('asdsadasd')
                    PickupOrder.objects.update_or_create(
                        order=order,
                        defaults={'date_pickup': date_order}
                    )

            return Response({'message': 'Данные были обновлены'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDeliveriedOrderView(generics.ListCreateAPIView):
    serializer_class = GetAllUserOrder
    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Order.objects.filter(user=user_id, status__in=[3, 4, 7])



#Прогнозирование
# Функция для расчета среднего скользящего
def moving_average(series, window_size):
    moving_averages = []
    for i in range(len(series) - window_size + 1):
        window = series[i:i + window_size]
        moving_averages.append(math.ceil(sum(window) / window_size))
    return moving_averages


# Функция для прогноза
def prognoz(data, step, prognoz):
    m = None
    for i in range(prognoz):
        m = moving_average(data, step)
        y = math.ceil(m[-1] + (1 / step) * (data[-1] - data[-2]))
        data.append(y)

    return data, m


# Представление для прогноза
class AttendanceListCreateView(generics.ListCreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

class AttendancePrognozView(APIView):
    def get(self, request, step, t):
        # Получаем все записи Attendance и извлекаем counts
        attendance_records = Attendance.objects.all().order_by('id')
        data = [record.count for record in attendance_records]

        if len(data) < step:
            return Response({"error": "Недостаточно данных для вычисления среднего скользящего"})

        date_prognoz = data.copy()
        print(date_prognoz)
        test = prognoz(date_prognoz, step, t)

        e = sum((abs((data[i] - test[1][i - 1]) / data[i]) * 100) for i in range(1, len(data) - 1))
        MAE = sum(data[i] - test[1][i - 1] for i in range(1, len(data) - 1)) / t
        MSE = math.sqrt(sum((data[i] - test[1][i - 1]) ** 2 for i in range(1, len(data) - 1)) / t)
        e_minus = e / t

        response_data = {
            "data": data,
            "moving_averages": test[1],
            "forecast_values": test[0],
            "MAE": MAE,
            "MSE": MSE,
            "average_relative_error": e_minus
        }

        return Response(response_data)

class AccountingView(generics.ListCreateAPIView):
    queryset = Accounting.objects.all()
    serializer_class = AccountingSerializer

    def post(self, request, *args, **kwargs):
        # Получение или создание экземпляра Accounting
        accounting_instance, created = Accounting.objects.get_or_create(
            device=request.data['device'],  # Предполагается, что device является уникальным
            defaults={'quantity': request.data.get('quantity', 0), 'status': request.data.get('status', None)}
        )
        # Обновление поля quantity, если объект существует
        if not created:
            accounting_instance.quantity = request.data.get('quantity', accounting_instance.quantity)
            accounting_instance.save()
        serializer = self.get_serializer(accounting_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SalesForecastView(APIView):

    def get(self, request, *args, **kwargs):
        # Получаем фактические данные о продажах
        sales_data = list(Order.objects.annotate(date=TruncDate('date_order')).values('date').annotate(
            total_sales=Sum('total_amount')
        ).order_by('date'))

        if not sales_data:
            return Response({"detail": "Нет данных о продажах"}, status=status.HTTP_200_OK)

        sales_dates = [data['date'] for data in sales_data]
        actual_sales = [data['total_sales'] for data in sales_data]

        # Расчет прогнозных продаж
        forecast_dates, forecasted_sales, future_forecast_dates, future_forecasted_sales = self.calculate_forecast(sales_data)

        response_data = {
            'sales_dates': sales_dates,
            'actual_sales': actual_sales,
            'forecast_dates': forecast_dates,
            'forecasted_sales': forecasted_sales,
            'future_forecast_dates': future_forecast_dates,
            'future_forecasted_sales': future_forecasted_sales,
        }

        serializer = SalesForecastSerializer(response_data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def calculate_forecast(self, sales_data):
        dates = np.array([data['date'].toordinal() for data in sales_data]).reshape(-1, 1)
        sales = np.array([data['total_sales'] for data in sales_data])

        model = LinearRegression()
        model.fit(dates, sales)

        forecast_dates = []
        forecasted_sales = []

        for i in range(len(sales_data) - 1):
            next_date = sales_data[i + 1]['date']
            future_sales = model.predict([[next_date.toordinal()]])
            forecasted_sales.append(future_sales[0])
            forecast_dates.append(next_date)

        # Прогноз на следующий день после последней даты продаж
        last_date = sales_data[-1]['date']
        next_date = last_date + timedelta(days=1)
        future_sales = model.predict([[next_date.toordinal()]])
        forecasted_sales.append(future_sales[0])
        forecast_dates.append(next_date)

        # Прогноз на 30 дней вперед от последней даты
        future_forecast_dates = []
        future_forecasted_sales = []
        for i in range(30):
            next_date += timedelta(days=1)
            future_sales = model.predict([[next_date.toordinal()]])
            future_forecasted_sales.append(future_sales[0])
            future_forecast_dates.append(next_date)

        return forecast_dates, forecasted_sales, future_forecast_dates, future_forecasted_sales