from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import About, Testimonial, PressItem, Award
from .serializers import AboutSerializer, TestimonialSerializer, PressItemSerializer, AwardSerializer


class AboutView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        about = About.objects.first()
        if not about:
            return Response({})
        return Response(AboutSerializer(about).data)


class TestimonialListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = TestimonialSerializer
    queryset = Testimonial.objects.filter(is_featured=True)


class PressListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = PressItemSerializer
    queryset = PressItem.objects.all()


class AwardListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = AwardSerializer
    queryset = Award.objects.all()