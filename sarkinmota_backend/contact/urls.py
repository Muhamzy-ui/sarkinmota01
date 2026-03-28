from django.urls import path
from .views import ContactCreateView, AdminMessageListView

urlpatterns = [
    path('', ContactCreateView.as_view(), name='contact'),
    path('messages/', AdminMessageListView.as_view(), name='admin-messages'),
]