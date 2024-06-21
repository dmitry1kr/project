from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from .views import *
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'basket/(?P<user_id>\d+)', BasketDeviceView, basename='basket')

urlpatterns = [
    path('token/', UserTokenView.as_view()),
    path('token/refresh', TokenRefreshView.as_view()),
    path('register/', RegisterView.as_view()),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('profile/<int:pk>', ProfileView.as_view(), name='profile-user'),
    path('dashboard/', dashboards),
    path('types/', TypeListCreate.as_view(), name='type-list'),
    path('brands/', BrandListCreate.as_view(), name='brand-list'),
    path('character/', CharacterView.as_view(), name='character-for-type'),
    path('character/device/', CharacterDeviceView.as_view(), name='character-device'),
    path('devices/', DeviceListCreateAPIView.as_view(), name='device-list-create'),
    path('devices/<int:pk>/', DeviceRetrieveUpdateDestroyAPIView.as_view(), name='device-retrieve-update-destroy'),
    path('comments/all/<int:pk>/', CommentListCreateAPIView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', CommentRetrieveUpdateDestroyAPIView.as_view(), name='comment-detail'),
    path('basket/<int:user_id>/', BasketDeviceView.as_view(), name='basket-detail'),
    path('basket/<int:user_id>/devices/<int:device_id>/', BasketDeviceView.as_view(), name='basket-device-detail'),
    path('basket/<int:pk>/update_quantity/', UpdateBasketDeviceQuantity.as_view(), name='update-basket-device-quantity'),
    path('basket/<int:user_id>/delete_all/', BasketDeviceViewDeleteAll.as_view(), name='basket-delete-all'),
    path('orders/', OrderListCreateAPIView.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderRetrieveUpdateDestroyAPIView.as_view(), name='order-detail'),
    path('orders/<int:pk>/delivery', OrderDeliveryView.as_view(), name='order-detail'),
    path('orders/<int:pk>/pickup', OrderPickupView.as_view(), name='order-detail'),
    path('orders/pay/<int:pk>/', OrderUserNotPayed.as_view(), name='order-not-payed'),
    path('orders/device/', Test.as_view(), name='order-list-test'),
    path('orders/last_order_number/', OrderLastNumberView.as_view(), name='order-last-number'),
    path('wallet/<int:pk>', UserWalletView.as_view(), name='wallet-user'),
    path('wallet/<int:pk>/topup/', WalletTopUpView.as_view(), name='wallet-topup'),
    path('wallet/<int:pk>/pay-order/', OrderPaymentView.as_view(), name='order-payment'),
    path('status/', GetStatusView.as_view(), name='get-status-order'),
    path('status/change/<int:pk>/', StatusChangeView.as_view(), name='change-status'),
    path('delivery/<int:pk>', UserDeliveriedOrderView.as_view(), name='delivery-user'),
    path('attendance/', AttendanceListCreateView.as_view(), name='attendance-list-create'),
    path('attendance/prognoz/<int:step>/<int:t>/', AttendancePrognozView.as_view(), name='attendance-prognoz'),
    path('accounting/', AccountingView.as_view(), name='accounting-all'),
    path('daily-sales/', SalesForecastView.as_view(), name='daily-sales'),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)