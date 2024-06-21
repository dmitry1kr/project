from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.signals import user_logged_in

#
class User(AbstractUser):
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(default='USER')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username


class UserLogin(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    login_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} logged in at {self.login_time}"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    first_name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    patronymic = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=17)
    image = models.ImageField(upload_to='user/', default='user/default_user.svg')

    def __str__(self):
        return f"{self.first_name} {self.surname} {self.patronymic}"

#
class Type(models.Model):
    name = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to='type/', default='type/default_type.svg')

    def __str__(self):
        return self.name

#
class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    logo_brand = models.FileField(upload_to='brand/')

    def __str__(self):
        return self.name


class Device(models.Model):
    name_device = models.CharField(max_length=100, unique=True)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    type = models.ForeignKey(Type, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_device = models.ImageField(upload_to='device', default='device.svg')
    info = models.CharField(max_length=5000)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return self.name_device


class Characteristic(models.Model):
    name = models.CharField(max_length=100)
    type = models.ForeignKey(Type, related_name='characteristics', on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class DeviceCharacteristic(models.Model):
    device = models.ForeignKey(Device, related_name='characteristics', on_delete=models.CASCADE)
    characteristic = models.ForeignKey(Characteristic, on_delete=models.CASCADE)
    value = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.device.name_device} - {self.characteristic.name}: {self.value}"


class Rating(models.Model):
    device_id = models.OneToOneField(Device, on_delete=models.CASCADE)
    mean_rating = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    count_feedbacks = models.PositiveIntegerField(default=0)


class Comment(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment_text = models.CharField(max_length=1000)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    def __str__(self):
        return f"Comment by {self.user} on {self.device}"


class Basket(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user}'s basket"


class BasketDevice(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    basket = models.ForeignKey(Basket, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

class Status(models.Model):
    description = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.description}"


class TypeOrder(models.Model):
    type_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.type_name}"


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.ForeignKey(Status, on_delete=models.CASCADE)
    type_order = models.ForeignKey(TypeOrder, on_delete=models.CASCADE)
    date_order = models.DateTimeField()
    payment_method = models.CharField(max_length=100)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    number_order = models.CharField(max_length=100, unique=True, default=None)

    def save(self, *args, **kwargs):
        if not self.number_order:
            last_order = Order.objects.all().order_by('id').last()
            if last_order:
                last_number = int(last_order.number_order)
                self.number_order = '{:010d}'.format(last_number + 1)
            else:
                self.number_order = '0000000001'
        super(Order, self).save(*args, **kwargs)


class OrderDevice(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_devices')
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)


class DeliveryOrder(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='delivery_order')
    name_user = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20)
    address = models.TextField()
    entrance = models.CharField(max_length=10)
    flat = models.CharField(max_length=10)
    comments = models.TextField(null=True, blank=True)
    date_delivery = models.DateTimeField(null=True, blank=True)


class PickupOrder(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='pickup_order')
    name_user = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20)
    date_pickup = models.DateTimeField(null=True, blank=True)


class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default='0.00')


@receiver(post_save, sender=User)
def create_user_wallet(sender, instance, created, **kwargs):
    if created:
        Wallet.objects.get_or_create(user=instance)



@receiver(post_save, sender=User)
def create_user_basket(sender, instance, created, **kwargs):
    if created:
        Basket.objects.get_or_create(user=instance)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)


@receiver(post_save, sender=User)
def save_user(sender, instance, **kwargs):
    instance.profile.save()


@receiver(post_save, sender=Device)
def create_rating(sender, instance, created, **kwargs):
    if created:
        Rating.objects.create(device_id=instance)


@receiver(post_save, sender=Comment)
def update_rating_on_comment_save(sender, instance, **kwargs):
    device = instance.device
    comments = Comment.objects.filter(device_id=device)
    total_rating = sum(comment.rating for comment in comments)
    count_feedbacks = comments.count()
    mean_rating = total_rating / count_feedbacks if count_feedbacks != 0 else 0
    rating, created = Rating.objects.get_or_create(device_id=device)
    rating.mean_rating = mean_rating
    rating.count_feedbacks = count_feedbacks
    rating.save()


@receiver(post_delete, sender=Comment)
def update_rating_on_comment_delete(sender, instance, **kwargs):
    device = instance.device
    comments = Comment.objects.filter(device_id=device)
    total_rating = sum(comment.rating for comment in comments)
    count_feedbacks = comments.count()
    mean_rating = total_rating / count_feedbacks if count_feedbacks != 0 else 0
    rating, created = Rating.objects.get_or_create(device_id=device)
    rating.mean_rating = mean_rating
    rating.count_feedbacks = count_feedbacks
    rating.save()


@receiver(user_logged_in, sender=User)
def log_user_login(sender, request, user, **kwargs):
    UserLogin.objects.create(user=user)


class Attendance(models.Model):
    month = models.CharField(max_length=20)
    count = models.IntegerField()

    def __str__(self):
        return f"{self.month}: {self.count}"


class Accounting(models.Model):
    device = models.OneToOneField(Device, on_delete=models.CASCADE, unique=True)
    quantity = models.IntegerField()
    status = models.CharField(max_length=100, null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.quantity > 5:
            self.status = 'в наличии'
        elif 0 < self.quantity <= 5:
            self.status = 'осталось мало'
        elif self.quantity == 0:
            self.status = 'закончился'
        else:
            self.status = 'недопустимое значение'

        super(Accounting, self).save(*args, **kwargs)


