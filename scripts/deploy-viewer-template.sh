#!/bin/bash
set -e

# Ensure Homebrew path is included (common on Apple Silicon Macs)
export PATH="/opt/homebrew/bin:$PATH"

# Change into the template directory (assuming script is run from project root or scripts/)
cd "$(dirname "$0")/../truth-engine-viewer"

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "Error: gh command not found. Please install GitHub CLI or ensure it is in your PATH."
    exit 1
fi

# Create repository if not already linked
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "Creating public GitHub repository 'truth-engine-viewer'..."
    gh repo create truth-engine-viewer --public --source=. --remote=origin --push
else
    echo "Remote origin already exists. Pushing changes..."
    git push -u origin main
fi

echo ""
echo "✅ Success! Your Viewer Template is deployed to GitHub."
echo "Paste this URL into your Truth Engine dashboard:"
gh browse -n
