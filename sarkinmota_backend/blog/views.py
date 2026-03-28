from rest_framework import viewsets, generics, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Post, PostCategory, Tag
from .serializers import PostListSerializer, PostDetailSerializer, PostCategorySerializer


class PostCategoryListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = PostCategorySerializer
    queryset = PostCategory.objects.all()


class PostViewSet(viewsets.ModelViewSet):
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['published_at', 'views']
    ordering = ['-published_at']

    def get_serializer_class(self):
        if self.action in ['list', 'featured']:
            return PostListSerializer
        return PostDetailSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'featured']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = Post.objects.select_related('category').prefetch_related('tags')

        # Public: published only
        if not self.request.user.is_authenticated:
            qs = qs.filter(is_published=True)

        # Filter by category slug
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__slug=category)

        # Filter by tag slug
        tag = self.request.query_params.get('tag')
        if tag:
            qs = qs.filter(tags__slug=tag)

        return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Post.objects.filter(pk=instance.pk).update(views=instance.views + 1)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        posts = Post.objects.filter(
            is_published=True, is_featured=True
        ).select_related('category')[:6]
        serializer = PostListSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)