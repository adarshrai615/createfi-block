#!/bin/bash

echo "🚀 CREATEFI GitHub Deployment Script"
echo "====================================="
echo ""

# Check if repository is ready
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository"
    exit 1
fi

echo "✅ Repository is ready for deployment"
echo ""

# Get current status
echo "📊 Repository Status:"
echo "- Branch: $(git branch --show-current)"
echo "- Commits: $(git log --oneline | wc -l)"
echo "- Files: $(find . -type f | wc -l)"
echo ""

# Check if remote is already set
if git remote get-url origin > /dev/null 2>&1; then
    echo "✅ Remote origin already configured:"
    git remote get-url origin
    echo ""
    echo "To push to GitHub, run:"
    echo "git push -u origin main"
else
    echo "📝 To deploy to GitHub:"
    echo ""
    echo "1. Create a new repository on GitHub:"
    echo "   - Name: createfi-blockchain"
    echo "   - Description: Complete DeFi blockchain ecosystem with professional frontend"
    echo "   - Don't initialize with README"
    echo ""
    echo "2. Add remote and push:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/createfi-blockchain.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
fi

echo "🎯 Repository Contents:"
echo "- Blockchain: Complete Substrate implementation"
echo "- Frontend: Professional React application"
echo "- Documentation: Comprehensive guides"
echo "- CI/CD: GitHub Actions pipeline"
echo ""

echo "📁 Key Files:"
ls -la *.md *.toml *.sh 2>/dev/null | head -10
echo ""

echo "🎊 Ready for GitHub deployment!"
echo "Follow the steps above to push your CREATEFI repository to GitHub!"