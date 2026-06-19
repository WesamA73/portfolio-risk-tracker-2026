#!/bin/bash

# Portfolio Risk Tracker - Quick Setup Script
# This script helps set up the development environment

set -e

echo "🚀 Portfolio Risk Tracker - Setup Script"
echo "========================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check for .env.local
echo ""
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found"
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created"
    echo ""
    echo "⚠️  Please update .env.local with your Supabase credentials:"
    echo "   NEXT_PUBLIC_SUPABASE_URL=your_url"
    echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key"
    echo ""
    echo "📖 See SUPABASE_SETUP.md for detailed instructions"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For detailed Supabase setup, see SUPABASE_SETUP.md"
