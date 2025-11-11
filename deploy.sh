#!/bin/bash

echo "🚀 Smart Faculty Billing System - Deployment Script"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to 18+."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Generate database migrations
echo "🗄️ Setting up database..."
npm run db:generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate database migrations"
    exit 1
fi

# Apply migrations
npm run db:migrate

if [ $? -ne 0 ]; then
    echo "❌ Failed to apply database migrations"
    exit 1
fi

echo "✅ Database migrations applied successfully"

# Seed the database
echo "🌱 Seeding database with sample data..."
npm run db:seed

if [ $? -ne 0 ]; then
    echo "❌ Failed to seed database"
    exit 1
fi

echo "✅ Database seeded successfully"

# Build the application
echo "🔨 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build the application"
    exit 1
fi

echo "✅ Application built successfully"

# Start the application
echo "🚀 Starting the application..."
echo ""
echo "==================================="
echo "🎉 Deployment Complete!"
echo "==================================="
echo ""
echo "📱 Application is running at: http://localhost:3000"
echo ""
echo "👤 Test Accounts:"
echo "   Admin: admin@university.edu / admin123"
echo "   Faculty: john.smith@university.edu / faculty123"
echo ""
echo "🔧 Features Available:"
echo "   ✅ Workload logging with AI classification"
echo "   ✅ Timesheet validation and conflict detection"
echo "   ✅ Analytics dashboard with charts"
echo "   ✅ Billing calculations and reports"
echo "   ✅ Admin and faculty role management"
echo ""
echo "📚 API Documentation:"
echo "   GET  /api/worklogs - Get work logs"
echo "   POST /api/worklogs - Create work log"
echo "   GET  /api/subjects - Get subjects"
echo "   POST /api/auth/login - User login"
echo ""
echo "Press Ctrl+C to stop the server"

npm run dev