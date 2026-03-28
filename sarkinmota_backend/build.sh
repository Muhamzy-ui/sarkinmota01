#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting Render build process..."

# Step 1: Install dependencies
pip install -r requirements.txt

# Step 2: Collect static files
python manage.py collectstatic --no-input

# Step 3: Apply database migrations
python manage.py migrate
