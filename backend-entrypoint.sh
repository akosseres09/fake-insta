#!/bin/sh

echo "Installing backend dependencies..."
npm install

echo "Building and starting backend server..."
npm run build && npm run start
