from django.contrib import admin
from .models import Post, PostCategory, Tag


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display  = ['title', 'category', 'is_published', 'is_featured', 'views', 'published_at']
    list_filter   = ['is_published', 'is_featured', 'category']
    list_editable = ['is_published', 'is_featured']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['tags']
    readonly_fields = ['views', 'created_at', 'updated_at']


@admin.register(PostCategory)
class PostCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}