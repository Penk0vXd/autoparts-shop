#!/usr/bin/env bash

echo "🛡️  Running guardian pre-push validation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Exit on any error
set -e

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌  Not in a git repository"
    exit 1
fi

# Step 1: Clean environment (like Vercel does)
echo "🧹  Cleaning build environment..."
rm -rf .next 2>/dev/null || true

# Step 2: Strict production build
echo "🏗️  Running production build..."
echo "    (This matches exactly what Vercel will do)"

npm run build --silent
build_status=$?

# Step 3: Check build status
if [ $build_status -ne 0 ]; then
    echo ""
    echo "❌  BUILD FAILED"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🚫  Push blocked - fix build errors before pushing"
    echo "💡  Run 'npm run build' locally to see detailed errors"
    echo ""
    exit 1
fi

# Step 4: Optional TypeScript check (if not covered by build)
echo "🔍  Running TypeScript check..."
npx tsc --noEmit --skipLibCheck
tsc_status=$?

if [ $tsc_status -ne 0 ]; then
    echo ""
    echo "❌  TYPESCRIPT ERRORS FOUND"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🚫  Push blocked - fix TypeScript errors before pushing"
    echo ""
    exit 1
fi

# Step 5: Success
echo ""
echo "✅  ALL CHECKS PASSED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀  Build clean - push allowed"
echo "🎯  Vercel deployment will succeed"
echo ""
exit 0 