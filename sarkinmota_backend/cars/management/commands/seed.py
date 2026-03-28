"""
management/commands/seed.py
Run: python manage.py seed
Populates the database with the same 8 cars that the frontend mock data used.
"""
from django.core.management.base import BaseCommand
from cars.models import Car, CarBrand, CarImage


BRANDS = ['Mercedes-Benz', 'Toyota', 'Lexus', 'Porsche', 'BMW', 'Honda', 'Range Rover']

CARS = [
    dict(title='Mercedes-Benz GLE 350 2022', brand='Mercedes-Benz', category='Tokunbo',
         price=68000000, year=2022, mileage=28000, transmission='Automatic',
         engine_size='2.0L Turbo', status='Available', badge='Premium', is_featured=True,
         description='Immaculate condition. Full leather interior, panoramic roof, 360 camera.'),
    dict(title='Toyota Land Cruiser V8 2021', brand='Toyota', category='Tokunbo',
         price=95000000, year=2021, mileage=35000, transmission='Automatic',
         engine_size='4.6L V8', status='Available', badge='Hot Bid', is_featured=True,
         description='The king of SUVs. Full option with third row seating.'),
    dict(title='Lexus LX 570 Sport 2020', brand='Lexus', category='Tokunbo',
         price=85000000, year=2020, mileage=42000, transmission='Automatic',
         engine_size='5.7L V8', status='Available', badge='New', is_featured=True,
         description='Sport edition with black exterior package.'),
    dict(title='Porsche Cayenne S 2021', brand='Porsche', category='Tokunbo',
         price=72000000, year=2021, mileage=19000, transmission='Automatic',
         engine_size='2.9L Turbo V6', status='Available', badge='Premium', is_featured=False,
         description='Cayenne S with Sport Chrono package. PASM suspension.'),
    dict(title='BMW X6 M50i 2022', brand='BMW', category='Foreign Used',
         price=58000000, year=2022, mileage=22000, transmission='Automatic',
         engine_size='4.4L V8', status='Available', badge='Hot Bid', is_featured=True,
         description='M50i Performance package. Iconic fastback SUV with 523hp twin-turbo V8.'),
    dict(title='Toyota Camry XSE 2023', brand='Toyota', category='Brand New',
         price=28000000, year=2023, mileage=0, transmission='Automatic',
         engine_size='2.5L', status='Available', badge='New', is_featured=False,
         description='Zero mileage. Brand new from dealer. Sport Edition with red interior.'),
    dict(title='Range Rover Autobiography 2021', brand='Range Rover', category='Tokunbo',
         price=125000000, year=2021, mileage=31000, transmission='Automatic',
         engine_size='5.0L V8', status='Available', badge='Premium', is_featured=True,
         description='Long Wheelbase Autobiography. The pinnacle of luxury SUVs.'),
    dict(title='Honda Accord Sport 2022', brand='Honda', category='Nigerian Used',
         price=16500000, year=2022, mileage=48000, transmission='Automatic',
         engine_size='1.5L Turbo', status='Sold', badge=None, is_featured=False,
         description='Well maintained. Honda Sensing safety suite.'),
]


class Command(BaseCommand):
    help = 'Seed the database with initial car brands and listings'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding brands...')
        brand_map = {}
        for name in BRANDS:
            brand, created = CarBrand.objects.get_or_create(name=name)
            brand_map[name] = brand
            if created:
                self.stdout.write(f'  Created brand: {name}')

        self.stdout.write('Seeding cars...')
        for car_data in CARS:
            brand_name = car_data.pop('brand')
            brand = brand_map.get(brand_name)
            car, created = Car.objects.update_or_create(
                title=car_data['title'],
                defaults={**car_data, 'brand': brand}
            )
            if created:
                self.stdout.write(f'  Created: {car.title}')
            else:
                self.stdout.write(f'  Updated: {car.title}')

        self.stdout.write(self.style.SUCCESS(
            f'\nDone! {len(BRANDS)} brands, {len(CARS)} car listings seeded.'
        ))
