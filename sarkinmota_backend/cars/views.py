from rest_framework import viewsets, generics, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import Car, CarBrand, CarBid, CarRequest, GalleryItem
from .serializers import (
    CarListSerializer, CarDetailSerializer,
    CarBrandSerializer, CarBidSerializer, CarRequestSerializer, GalleryItemSerializer
)


class CarBrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CarBrand.objects.all()
    serializer_class = CarBrandSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.select_related('brand').prefetch_related('images')
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'brand__name', 'description']
    ordering_fields = ['price', 'year', 'created_at', 'mileage']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action in ['list', 'featured']:
            return CarListSerializer
        return CarDetailSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'featured', 'stats']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params

        category = params.get('category')
        brand = params.get('brand')
        status_filter = params.get('status')
        badge = params.get('badge')
        min_price = params.get('min_price')
        max_price = params.get('max_price')
        min_year = params.get('min_year')
        max_year = params.get('max_year')
        transmission = params.get('transmission')

        if category:
            qs = qs.filter(category=category)
        if brand:
            qs = qs.filter(brand__name__icontains=brand)
        if status_filter:
            qs = qs.filter(status=status_filter)
        else:
            # Default: show Available cars
            qs = qs.filter(status='Available')
        if badge:
            qs = qs.filter(badge=badge)
        if min_price:
            qs = qs.filter(price__gte=min_price)
        if max_price:
            qs = qs.filter(price__lte=max_price)
        if min_year:
            qs = qs.filter(year__gte=min_year)
        if max_year:
            qs = qs.filter(year__lte=max_year)
        if transmission:
            qs = qs.filter(transmission=transmission)

        return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        Car.objects.filter(pk=instance.pk).update(views=instance.views + 1)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        cars = Car.objects.filter(
            is_featured=True, status='Available'
        ).select_related('brand').prefetch_related('images')[:8]
        serializer = self.get_serializer(cars, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def stats(self, request):
        return Response({
            'total_listings': Car.objects.count(),
            'available': Car.objects.filter(status='Available').count(),
            'sold_count': Car.objects.filter(status='Sold').count(),
            'brands_count': CarBrand.objects.count(),
        })


class CarBidCreateView(generics.CreateAPIView):
    """Public endpoint — anyone can submit a bid"""
    serializer_class = CarBidSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        bid = serializer.save()
        # TODO: send email notification via SendGrid
        return bid


class CarRequestCreateView(generics.CreateAPIView):
    """Public endpoint — anyone can request a car"""
    serializer_class = CarRequestSerializer
    permission_classes = [AllowAny]


# ── Admin-only views ──────────────────────────────────────────

class AdminBidListView(generics.ListAPIView):
    serializer_class = CarBidSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = CarBid.objects.select_related('car').order_by('-created_at')
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs


class AdminBidUpdateView(generics.UpdateAPIView):
    serializer_class = CarBidSerializer
    permission_classes = [IsAuthenticated]
    queryset = CarBid.objects.all()

    def partial_update(self, request, *args, **kwargs):
        bid = self.get_object()
        new_status = request.data.get('status')
        if new_status not in ['Accepted', 'Rejected', 'Pending']:
            return Response({'error': 'Invalid status'}, status=400)
        bid.status = new_status
        bid.save()
        return Response(CarBidSerializer(bid).data)


class AdminRequestListView(generics.ListAPIView):
    serializer_class = CarRequestSerializer
    permission_classes = [IsAuthenticated]
    queryset = CarRequest.objects.all().order_by('-created_at')


class GalleryViewSet(viewsets.ModelViewSet):
    queryset = GalleryItem.objects.all().order_by('order', '-created_at')
    serializer_class = GalleryItemSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        if not self.request.user.is_authenticated:
            qs = qs.filter(is_active=True)
        return qs