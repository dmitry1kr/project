from django.contrib import admin
from .models import User, Profile


class UserAdmin(admin.ModelAdmin):
    list_display = ['email']

class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'first_name', 'surname', 'patronymic']

admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)