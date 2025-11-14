#!/bin/bash

# Script to push project to GitHub
# Usage: ./push-to-github.sh <your-github-username> <repository-name>

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: ./push-to-github.sh <your-github-username> <repository-name>"
  echo "Example: ./push-to-github.sh witty no-mans-land-hotel"
  exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME=$2

echo "🚀 Setting up GitHub repository..."

# Check if remote already exists
if git remote get-url origin > /dev/null 2>&1; then
  echo "⚠️  Remote 'origin' already exists. Updating..."
  git remote set-url origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
else
  echo "➕ Adding remote 'origin'..."
  git remote add origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
fi

echo ""
echo "📋 Next steps:"
echo "1. Go to https://github.com/new"
echo "2. Create a new repository named: ${REPO_NAME}"
echo "3. DO NOT initialize with README, .gitignore, or license (we already have these)"
echo "4. After creating the repo, run this command to push:"
echo ""
echo "   git push -u origin main"
echo ""
echo "Or if you prefer SSH (if you have SSH keys set up):"
echo "   git remote set-url origin git@github.com:${GITHUB_USERNAME}/${REPO_NAME}.git"
echo "   git push -u origin main"
echo ""


