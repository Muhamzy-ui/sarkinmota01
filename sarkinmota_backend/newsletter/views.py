from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from .models import Subscriber
from .serializers import SubscriberSerializer


class NewsletterSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        if not email:
            return Response({'error': 'Email is required.'}, status=400)

        subscriber, created = Subscriber.objects.get_or_create(email=email)
        if not created:
            if subscriber.is_active:
                return Response({'message': 'You are already subscribed!'}, status=200)
            subscriber.is_active = True
            subscriber.save()

        return Response(
            {'message': 'Successfully subscribed! Welcome to the Sarkin Mota family.'},
            status=201 if created else 200
        )


class SubscriberListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriberSerializer
    queryset = Subscriber.objects.filter(is_active=True)