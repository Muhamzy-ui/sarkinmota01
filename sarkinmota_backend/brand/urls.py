from django.urls import path
from .views import AboutView, TestimonialListView, PressListView, AwardListView

urlpatterns = [
    path('about/', AboutView.as_view(), name='about'),
    path('testimonials/', TestimonialListView.as_view(), name='testimonials'),
    path('press/', PressListView.as_view(), name='press'),
    path('awards/', AwardListView.as_view(), name='awards'),
]