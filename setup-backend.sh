#!/bin/bash

echo "🚀 Setting up POS System Backend..."

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Create database and run migrations
echo "🗄️ Setting up database..."
npx prisma migrate dev --name init

# Seed the database
echo "🌱 Seeding database..."
npm run seed

# Start the development server
echo "🚀 Starting development server..."
npm run dev 