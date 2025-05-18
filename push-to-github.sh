#!/bin/bash

# GitHub repository details
GITHUB_USERNAME="anegis2023"
REPO_NAME="dxexcellencegenerator"
BRANCH="main"

# Prompt for GitHub Personal Access Token
echo "Enter your GitHub Personal Access Token:"
read -s TOKEN

# Set up Git configuration
git config user.name "$GITHUB_USERNAME"
git config user.email "pjaworski@anegis.com"

# Update remote URL with token for authentication
git remote set-url origin "https://$GITHUB_USERNAME:$TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Add all files, commit, and push
git add .
git commit -m "Update project with DX Excellence branding"
git push -u origin $BRANCH

# Reset the remote URL to remove the token (for security)
git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo "Push completed successfully!"
