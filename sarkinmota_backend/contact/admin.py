from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Message


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['subject', 'is_read']
    list_editable = ['is_read']
    search_fields = ['name', 'email', 'message']
    readonly_fields = ['created_at']