# brand/serializers.py
from rest_framework import serializers
from .models import About, Testimonial, PressItem, Award


class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = '__all__'


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'


class PressItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PressItem
        fields = '__all__'


class AwardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Award
        fields = '__all__'