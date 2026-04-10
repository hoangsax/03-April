#!/bin/bash

# Setup script for Fashion Emporium Web UI

echo "🛍️  Fashion Emporium - Web UI Setup"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install express

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 To start the web server, run:"
echo "   node web-server.js"
echo ""
echo "🌐 Then open http://localhost:3000 in your browser"
echo ""
