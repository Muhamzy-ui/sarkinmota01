from rest_framework import serializers
from .models import Post, PostCategory, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


class PostCategorySerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()

    class Meta:
        model = PostCategory
        fields = ['id', 'name', 'slug', 'post_count']

    def get_post_count(self, obj):
        return obj.posts.filter(is_published=True).count()


class PostListSerializer(serializers.ModelSerializer):
    category = PostCategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'excerpt', 'thumbnail',
            'category', 'tags', 'is_featured', 'published_at', 'views',
        ]


class PostDetailSerializer(serializers.ModelSerializer):
    category = PostCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=PostCategory.objects.all(), source='category', write_only=True, required=False
    )
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), source='tags', many=True, write_only=True, required=False
    )

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 'thumbnail',
            'category', 'category_id', 'tags', 'tag_ids',
            'is_published', 'is_featured', 'published_at', 'views',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['slug', 'views', 'created_at', 'updated_at']