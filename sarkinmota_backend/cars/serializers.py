from rest_framework import serializers
from .models import Car, CarImage, CarBrand, CarBid, CarRequest, GalleryItem


class CarImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarImage
        fields = ['id', 'image', 'is_primary', 'order']


class CarBrandSerializer(serializers.ModelSerializer):
    car_count = serializers.SerializerMethodField()

    class Meta:
        model = CarBrand
        fields = ['id', 'name', 'slug', 'logo', 'car_count']

    def get_car_count(self, obj):
        return obj.cars.filter(status='Available').count()


class CarListSerializer(serializers.ModelSerializer):
    brand = CarBrandSerializer(read_only=True)
    brand_id = serializers.PrimaryKeyRelatedField(
        queryset=CarBrand.objects.all(), source='brand', write_only=True
    )
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Car
        fields = [
            'id', 'title', 'slug', 'brand', 'brand_id', 'category',
            'price', 'mileage', 'year', 'transmission', 'engine_size',
            'color', 'status', 'badge', 'is_featured', 'whatsapp_link',
            'primary_image', 'created_at',
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(img.image.url)
        return None


class CarDetailSerializer(serializers.ModelSerializer):
    brand = CarBrandSerializer(read_only=True)
    brand_id = serializers.PrimaryKeyRelatedField(
        queryset=CarBrand.objects.all(), source='brand', write_only=True
    )
    images = CarImageSerializer(many=True, read_only=True)
    bid_count = serializers.SerializerMethodField()

    class Meta:
        model = Car
        fields = [
            'id', 'title', 'slug', 'brand', 'brand_id', 'category',
            'price', 'mileage', 'year', 'transmission', 'engine_size',
            'color', 'description', 'features', 'status', 'badge',
            'is_featured', 'whatsapp_link', 'views', 'images',
            'bid_count', 'created_at', 'updated_at',
        ]
        read_only_fields = ['slug', 'views', 'created_at', 'updated_at']

    def get_bid_count(self, obj):
        return obj.bids.filter(status='Pending').count()


class CarBidSerializer(serializers.ModelSerializer):
    car_title = serializers.CharField(source='car.title', read_only=True)

    class Meta:
        model = CarBid
        fields = [
            'id', 'car', 'car_title', 'bidder_name', 'bidder_phone',
            'bidder_email', 'amount', 'message', 'status', 'created_at',
        ]
        read_only_fields = ['status', 'created_at']


class CarRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarRequest
        fields = [
            'id', 'requester_name', 'requester_phone', 'requester_email',
            'car_brand', 'car_model', 'year_range', 'category', 'budget',
            'notes', 'status', 'created_at',
        ]
        read_only_fields = ['status', 'created_at']


class GalleryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryItem
        fields = ['id', 'image', 'url', 'caption', 'category', 'is_active', 'order', 'created_at']