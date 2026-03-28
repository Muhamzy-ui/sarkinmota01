from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class About(models.Model):
    bio                 = models.TextField()
    tagline             = models.CharField(max_length=200, blank=True)
    years_in_business   = models.PositiveSmallIntegerField(default=12)
    cars_sold           = models.PositiveIntegerField(default=300)
    tiktok_followers    = models.CharField(max_length=20, default='800K+')
    instagram_followers = models.CharField(max_length=20, default='479K+')
    twitter_followers   = models.CharField(max_length=20, default='144K+')
    whatsapp_number     = models.CharField(max_length=20, blank=True)
    phone               = models.CharField(max_length=20, blank=True)
    email               = models.EmailField(blank=True)
    location            = models.CharField(max_length=200, blank=True, default='Kano & Abuja, Nigeria')
    updated_at          = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'About'

    def __str__(self):
        return 'About Sarkin Mota'


class Testimonial(models.Model):
    customer_name  = models.CharField(max_length=150)
    customer_photo = models.ImageField(upload_to='testimonials/', null=True, blank=True)
    rating         = models.PositiveSmallIntegerField(
        default=5,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    review         = models.TextField()
    car_bought     = models.CharField(max_length=200, blank=True)
    city           = models.CharField(max_length=100, blank=True)
    is_featured    = models.BooleanField(default=True)
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.customer_name} — {self.rating}★'


class PressItem(models.Model):
    title       = models.CharField(max_length=300)
    publication = models.CharField(max_length=150)
    url         = models.URLField(blank=True)
    date        = models.DateField()
    thumbnail   = models.ImageField(upload_to='press/', null=True, blank=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f'{self.title} — {self.publication}'


class Award(models.Model):
    icon      = models.CharField(max_length=10, blank=True, default='🏆')
    title     = models.CharField(max_length=200)
    subtitle  = models.CharField(max_length=300, blank=True)
    year      = models.PositiveSmallIntegerField(null=True, blank=True)
    order     = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title