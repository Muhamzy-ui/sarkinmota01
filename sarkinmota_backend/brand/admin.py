from django.contrib import admin
from .models import About, Testimonial, PressItem, Award


@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'years_in_business', 'cars_sold', 'updated_at']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'rating', 'car_bought', 'city', 'is_featured']
    list_editable = ['is_featured']
    list_filter = ['rating', 'is_featured']


@admin.register(PressItem)
class PressItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'publication', 'date']
    ordering = ['-date']


@admin.register(Award)
class AwardAdmin(admin.ModelAdmin):
    list_display = ['title', 'subtitle', 'year', 'order']
    list_editable = ['order']