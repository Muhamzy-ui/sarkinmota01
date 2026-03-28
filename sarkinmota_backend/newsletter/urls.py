from django.urls import path
from .views import NewsletterSignupView, SubscriberListView

urlpatterns = [
    path('signup/', NewsletterSignupView.as_view(), name='newsletter-signup'),
    path('subscribers/', SubscriberListView.as_view(), name='newsletter-subscribers'),
]