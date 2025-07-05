#!/bin/bash

# LMS Project Development Setup Script
# This script helps contributors set up their local environment correctly

echo "🚀 Setting up LMS Project for development..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: This script must be run from the root of the git repository"
    exit 1
fi

# Fetch latest changes
echo "📥 Fetching latest changes from remote..."
git fetch origin

# Check if development branch exists
if git show-ref --verify --quiet refs/remotes/origin/development; then
    echo "✅ Development branch found"
    
    # Check if we're already on development branch
    if [ "$(git branch --show-current)" = "development" ]; then
        echo "✅ Already on development branch"
    else
        echo "🔄 Switching to development branch..."
        git checkout development
    fi
    
    # Pull latest changes
    echo "📥 Pulling latest changes..."
    git pull origin development
    
    echo "✅ Setup complete! You're now on the development branch with latest changes."
    echo ""
    echo "📋 Next steps:"
    echo "1. Create a feature branch: git checkout -b feature/your-feature-name"
    echo "2. Make your changes"
    echo "3. Commit and push: git push origin feature/your-feature-name"
    echo "4. Create a Pull Request targeting the development branch"
    
else
    echo "❌ Error: Development branch not found on remote"
    echo "Please ensure the development branch exists on the remote repository"
    exit 1
fi 