from django.db import models
from django.utils.text import slugify
from django.utils import timezone


class PostCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)

    class Meta:
        verbose_name_plural = 'Post Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Post(models.Model):
    title        = models.CharField(max_length=300)
    slug         = models.SlugField(unique=True, blank=True, max_length=320)
    content      = models.TextField()
    excerpt      = models.TextField(max_length=500, blank=True)
    thumbnail    = models.ImageField(upload_to='blog/', null=True, blank=True)
    category     = models.ForeignKey(PostCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    tags         = models.ManyToManyField(Tag, blank=True)
    is_published = models.BooleanField(default=False)
    is_featured  = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    views        = models.PositiveIntegerField(default=0)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            n = 1
            while Post.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f'{base}-{n}'
                n += 1
            self.slug = slug
        if self.is_published and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title