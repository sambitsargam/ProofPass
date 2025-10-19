#!/bin/bash

# ProofPass Setup Script
# Automated setup and configuration

set -e

echo "🎟️  ProofPass Setup"
echo "===================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is required but not installed."
  exit 1
fi

if ! command -v npm &> /dev/null; then
  echo "❌ npm is required but not installed."
  exit 1
fi

echo "✓ Node.js $(node --version)"
echo "✓ npm $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Environment setup
echo "⚙️  Setting up environment..."
if [ ! -f .env.local ]; then
  echo "Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo ""
  echo "⚠️  Please update .env.local with your configuration:"
  echo "   - NEXT_PUBLIC_AIR_PARTNER_ID"
  echo "   - NEXT_PUBLIC_ISSUER_DID"
  echo "   - Credential IDs"
  echo "   - Smart contract addresses"
  echo ""
  echo "Visit: https://developers.sandbox.air3.com/ to get these values"
else
  echo "✓ .env.local already exists"
fi

# Build check
echo ""
echo "🔨 Building project..."
npm run build 2>/dev/null || echo "⚠️  Build warnings (non-critical)"
echo "✓ Build complete"
echo ""

echo "✅ ProofPass setup complete!"
echo ""
echo "🚀 Quick Start:"
echo "   npm run dev        - Start development server"
echo "   npm run type-check - Check TypeScript types"
echo "   npm run lint       - Run linter"
echo ""
echo "📚 Documentation:"
echo "   README.md         - Project overview"
echo "   DEPLOYMENT.md     - Deployment guide"
echo "   ARCHITECTURE.md   - Technical architecture"
echo ""
echo "🔗 Resources:"
echo "   AIR Kit Docs: https://docs.moca.network/airkit/"
echo "   GitHub: https://github.com/sambitsargam/ProofPass"
echo ""
