from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarViewSet, CarBrandViewSet, CarBidCreateView, CarRequestCreateView, GalleryViewSet
from .image_views import CarImageUploadView

router = DefaultRouter()
router.register('brands', CarBrandViewSet, basename='brand')
router.register('gallery', GalleryViewSet, basename='gallery')
router.register('', CarViewSet, basename='car')

urlpatterns = [
    path('bids/', CarBidCreateView.as_view(), name='car-bid-create'),
    path('requests/', CarRequestCreateView.as_view(), name='car-request-create'),
    path('<int:pk>/images/upload/', CarImageUploadView.as_view(), name='car-image-upload'),
    path('', include(router.urls)),
]