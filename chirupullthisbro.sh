#!/bin/bash
# chirupullthisbro.sh - Pull all code from GitHub and sync DHRITI project dependencies

echo "=========================================="
echo "  Pulling latest code from GitHub repository... "
echo "=========================================="

# 1. Pull latest code from GitHub remote main branch
git pull origin main

if [ $? -ne 0 ]; then
  echo "⚠️ Warning: Git pull failed or encountered conflicts."
  exit 1
fi

echo "✓ Code pulled successfully from GitHub!"

# 2. Sync server database schema
echo ""
echo "🔄 Syncing database schema..."
(cd server && npx prisma db push)

# 3. Print success closure
echo ""
echo "=========================================="
echo "🚀 Successfully pulled & updated DHRITI!"
echo "   Run ./start.sh to launch all services."
echo "=========================================="
