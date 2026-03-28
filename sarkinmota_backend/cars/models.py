from django.db import models
from django.utils.text import slugify


class CarBrand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    logo = models.ImageField(upload_to='brands/', null=True, blank=True)

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Car(models.Model):
    CATEGORY_CHOICES = [
        ('Tokunbo', 'Tokunbo (Foreign Used)'),
        ('Nigerian Used', 'Nigerian Used'),
        ('Brand New', 'Brand New'),
    ]
    STATUS_CHOICES = [
        ('Available', 'Available'),
        ('Sold', 'Sold'),
        ('Reserved', 'Reserved'),
        ('Auction', 'Auction'),
    ]
    BADGE_CHOICES = [
        ('New', 'New Arrival'),
        ('Hot Bid', 'Hot Bid'),
        ('Premium', 'Premium'),
        ('Featured', 'Featured'),
    ]
    TRANSMISSION_CHOICES = [
        ('Automatic', 'Automatic'),
        ('Manual', 'Manual'),
    ]

    title           = models.CharField(max_length=200)
    slug            = models.SlugField(unique=True, blank=True, max_length=220)
    brand           = models.ForeignKey(CarBrand, on_delete=models.SET_NULL, null=True, related_name='cars')
    category        = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    price           = models.DecimalField(max_digits=15, decimal_places=2)
    mileage         = models.PositiveIntegerField(default=0, help_text='In kilometres')
    year            = models.PositiveSmallIntegerField()
    transmission    = models.CharField(max_length=20, choices=TRANSMISSION_CHOICES, default='Automatic')
    engine_size     = models.CharField(max_length=30, blank=True)
    color           = models.CharField(max_length=50, blank=True)
    description     = models.TextField(blank=True)
    features        = models.JSONField(default=list, blank=True)
    status          = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Available')
    badge           = models.CharField(max_length=20, choices=BADGE_CHOICES, null=True, blank=True)
    is_featured         = models.BooleanField(default=False)
    is_deal_of_the_week = models.BooleanField(default=False)
    whatsapp_link       = models.URLField(blank=True)
    views           = models.PositiveIntegerField(default=0)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            n = 1
            while Car.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f'{base}-{n}'
                n += 1
            self.slug = slug
        # Auto-build WhatsApp link if empty
        if not self.whatsapp_link:
            from django.conf import settings
            msg = f'Hello! I am interested in the {self.title}. Please share more details.'
            from urllib.parse import quote
            self.whatsapp_link = f'https://wa.me/{settings.WHATSAPP_NUMBER}?text={quote(msg)}'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class CarImage(models.Model):
    car        = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='images')
    image      = models.ImageField(upload_to='cars/')
    is_primary = models.BooleanField(default=False)
    order      = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.car.title} — Image {self.order}'


class CarBid(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
    ]

    car          = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='bids')
    bidder_name  = models.CharField(max_length=150)
    bidder_phone = models.CharField(max_length=20)
    bidder_email = models.EmailField()
    amount       = models.DecimalField(max_digits=15, decimal_places=2)
    message      = models.TextField(blank=True)
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Bid by {self.bidder_name} on {self.car.title} — ₦{self.amount}'


class CarRequest(models.Model):
    STATUS_CHOICES = [
        ('New', 'New'),
        ('In Progress', 'In Progress'),
        ('Fulfilled', 'Fulfilled'),
        ('Closed', 'Closed'),
    ]

    requester_name   = models.CharField(max_length=150)
    requester_phone  = models.CharField(max_length=20)
    requester_email  = models.EmailField(blank=True)
    car_brand        = models.CharField(max_length=100, blank=True)
    car_model        = models.CharField(max_length=100, blank=True)
    year_range       = models.CharField(max_length=50, blank=True)
    category         = models.CharField(max_length=30, blank=True)
    budget           = models.CharField(max_length=100, blank=True)
    notes            = models.TextField(blank=True)
    status           = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New')
    created_at       = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Request from {self.requester_name} — {self.car_brand} {self.car_model}'


class GalleryItem(models.Model):
    CATEGORY_CHOICES = [
        ('cars', 'Cars'),
        ('showroom', 'Showroom'),
        ('dr-aliyu', 'Dr. Aliyu'),
    ]

    image    = models.ImageField(upload_to='gallery/', null=True, blank=True)
    url      = models.URLField(blank=True, help_text='External image URL (use if not uploading)')
    caption  = models.CharField(max_length=255, blank=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='cars')
    order    = models.PositiveIntegerField(default=0, help_text='Lower = appears first')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Gallery Item'
        verbose_name_plural = 'Gallery Items'

    def __str__(self):
        return f'[{self.category}] {self.caption or "Untitled"}'

    def get_src(self):
        """Returns the best image source — uploaded file or external URL."""
        if self.image:
            return self.image.url
        return self.url