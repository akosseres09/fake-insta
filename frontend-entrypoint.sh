#!/bin/sh

echo "Installing frontend dependencies..."
npm install

echo "Starting Angular development server..."
ng serve --host 0.0.0.0 --poll=2000 --port 4200
