from django.urls import path
from .views import AdminBidListView, AdminBidUpdateView, AdminRequestListView

urlpatterns = [
    path('bids/', AdminBidListView.as_view(), name='admin-bids'),
    path('bids/<int:pk>/', AdminBidUpdateView.as_view(), name='admin-bid-update'),
    path('requests/', AdminRequestListView.as_view(), name='admin-requests'),
]