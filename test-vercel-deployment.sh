#!/bin/bash

# Test Vercel Deployment Script
# Usage: ./test-vercel-deployment.sh https://your-project.vercel.app

if [ -z "$1" ]; then
    echo "❌ Error: Please provide your Vercel URL"
    echo "Usage: ./test-vercel-deployment.sh https://your-project.vercel.app"
    exit 1
fi

VERCEL_URL="$1"
echo "🧪 Testing Vercel deployment at: $VERCEL_URL"
echo ""

# Test 1: Check if API is accessible
echo "Test 1: Checking API accessibility..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL/api/profile/me")
if [ "$STATUS" = "401" ]; then
    echo "✅ API is accessible (401 Unauthorized is expected without login)"
elif [ "$STATUS" = "200" ]; then
    echo "✅ API is accessible (already logged in)"
else
    echo "❌ API returned unexpected status: $STATUS"
fi
echo ""

# Test 2: Try to register a test account
echo "Test 2: Testing registration endpoint..."
REGISTER_RESPONSE=$(curl -s -X POST "$VERCEL_URL/api/auth" \
    -H "Content-Type: application/json" \
    -d '{"action":"register","email":"test-'$(date +%s)'@example.com","password":"testpass123"}')

if echo "$REGISTER_RESPONSE" | grep -q "registered"; then
    echo "✅ Registration works! Database is connected."
    echo "Response: $REGISTER_RESPONSE"
elif echo "$REGISTER_RESPONSE" | grep -q "RATE_LIMIT"; then
    echo "⚠️  Rate limited (this is normal if you tested multiple times)"
    echo "Wait 1 minute and try again"
elif echo "$REGISTER_RESPONSE" | grep -q "CONFLICT"; then
    echo "⚠️  Account already exists (this is fine)"
else
    echo "❌ Registration failed"
    echo "Response: $REGISTER_RESPONSE"
    echo ""
    echo "Possible issues:"
    echo "1. Environment variables not set in Vercel"
    echo "2. Deployment hasn't finished yet"
    echo "3. Database connection issue"
fi
echo ""

# Test 3: Check if dashboard loads
echo "Test 3: Checking dashboard page..."
DASHBOARD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL/dashboard")
if [ "$DASHBOARD_STATUS" = "200" ]; then
    echo "✅ Dashboard page loads successfully"
else
    echo "❌ Dashboard returned status: $DASHBOARD_STATUS"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Visit: $VERCEL_URL/dashboard"
echo "2. Try to register a new account"
echo "3. If it works, you're all set! 🎉"
echo ""
echo "If registration fails:"
echo "1. Check Vercel logs: vercel logs --follow"
echo "2. Verify environment variables are set"
echo "3. Make sure you redeployed after adding variables"
echo ""
