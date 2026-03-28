"""
Image upload endpoint for car listings.
POST /api/cars/<id>/images/upload/
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Car, CarImage
from .serializers import CarImageSerializer


class CarImageUploadView(APIView):
    """
    Accepts multipart/form-data with:
    - image      (file)
    - is_primary (boolean, optional)
    """
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request, pk):
        try:
            car = Car.objects.get(pk=pk)
        except Car.DoesNotExist:
            return Response({'error': 'Car not found.'}, status=status.HTTP_404_NOT_FOUND)

        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'error': 'No image file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        is_primary = request.data.get('is_primary', 'false').lower() == 'true'

        # If this will be primary, demote all others
        if is_primary:
            car.images.filter(is_primary=True).update(is_primary=False)

        # Auto-assign primary if this is the first image
        if not car.images.exists():
            is_primary = True

        img = CarImage.objects.create(
            car=car,
            image=image_file,
            is_primary=is_primary,
            order=car.images.count(),
        )

        serializer = CarImageSerializer(img, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        """DELETE /api/cars/<id>/images/upload/?image_id=<id>"""
        image_id = request.query_params.get('image_id')
        if not image_id:
            return Response({'error': 'image_id required.'}, status=400)
        try:
            img = CarImage.objects.get(pk=image_id, car__pk=pk)
        except CarImage.DoesNotExist:
            return Response({'error': 'Image not found.'}, status=404)
        
        # If we deleted primary, promote the next image
        was_primary = img.is_primary
        img.delete()
        if was_primary:
            next_img = CarImage.objects.filter(car__pk=pk).first()
            if next_img:
                next_img.is_primary = True
                next_img.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
