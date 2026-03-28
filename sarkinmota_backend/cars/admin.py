from django.contrib import admin
from django.utils.html import format_html
from .models import Car, CarImage, CarBrand, CarBid, CarRequest, GalleryItem


class CarImageInline(admin.TabularInline):
    model = CarImage
    extra = 3


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display  = ['title', 'brand', 'category', 'price', 'status', 'badge', 'is_featured', 'created_at']
    list_filter   = ['status', 'category', 'badge', 'brand', 'is_featured', 'transmission']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['status', 'badge', 'is_featured']
    inlines = [CarImageInline]
    readonly_fields = ['views', 'created_at', 'updated_at']
    fieldsets = (
        ('Basic Info', {'fields': ('title', 'slug', 'brand', 'category', 'badge', 'is_featured')}),
        ('Specs', {'fields': ('price', 'year', 'mileage', 'transmission', 'engine_size', 'color')}),
        ('Content', {'fields': ('description', 'features', 'whatsapp_link')}),
        ('Status', {'fields': ('status', 'views', 'created_at', 'updated_at')}),
    )


@admin.register(CarBrand)
class CarBrandAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(CarBid)
class CarBidAdmin(admin.ModelAdmin):
    list_display  = ['bidder_name', 'car', 'amount', 'status', 'created_at']
    list_filter   = ['status']
    list_editable = ['status']
    readonly_fields = ['created_at']


@admin.register(CarRequest)
class CarRequestAdmin(admin.ModelAdmin):
    list_display  = ['requester_name', 'car_brand', 'car_model', 'budget', 'status', 'created_at']
    list_filter   = ['status']
    list_editable = ['status']


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display  = ['thumb_preview', 'caption', 'category', 'order', 'is_active', 'created_at']
    list_filter   = ['category', 'is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['caption']
    readonly_fields = ['thumb_preview', 'created_at']

    def thumb_preview(self, obj):
        src = obj.get_src()
        if src:
            return format_html('<img src="{}" style="height:48px;width:72px;object-fit:cover;border-radius:4px"/>', src)
        return '—'
    thumb_preview.short_description = 'Preview'