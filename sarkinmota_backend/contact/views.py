from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Message
from .serializers import MessageSerializer


class ContactCreateView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        msg = serializer.save()
        # TODO: Send SendGrid notification to admin
        return msg


class AdminMessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Message.objects.all()
        unread = self.request.query_params.get('unread')
        if unread == 'true':
            qs = qs.filter(is_read=False)
        return qs