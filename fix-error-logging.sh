#!/bin/bash

# Fix Error Logging - Remove PII exposure from console.error calls
# This script updates all API routes to use safe logging

echo "🔧 Fixing error logging in API routes..."
echo ""

# Files that need updating
FILES=(
    "app/api/profile/draft/route.ts"
    "app/api/profile/publish/route.ts"
    "app/api/profile/me/route.ts"
    "app/api/profile/unpublish/route.ts"
    "app/api/profile/route.ts"
    "app/api/auth/route.ts"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "📝 Updating $file..."

        # 1. Add safeLogError to imports
        if grep -q "safeLogError" "$file"; then
            echo "   ✅ Already has safeLogError import"
        else
            # Add to existing truth-engine import
            sed -i.bak 's/} from .@\/lib\/truth-engine./,\n    safeLogError,\n} from '\''@\/lib\/truth-engine'\'';/' "$file"
            echo "   ✅ Added safeLogError to imports"
        fi

        # 2. Replace console.error with safeLogError
        # Match: console.error('POST /api/... error:', err);
        # Replace with: safeLogError('POST /api/...', err);

        # This sed command finds console.error lines and replaces them
        sed -i.bak -E "s/console\.error\('([^']+) error:', err\);/safeLogError('\1', err);/g" "$file"

        echo "   ✅ Replaced console.error with safeLogError"
        echo ""
    else
        echo "⚠️  File not found: $file"
    fi
done

echo ""
echo "✅ All files updated!"
echo ""
echo "📋 Next steps:"
echo "1. Review the changes in each file"
echo "2. Remove .bak backup files: rm app/api/**/*.bak"
echo "3. Test the API endpoints"
echo "4. Commit: git add . && git commit -m 'fix: sanitize error logs to prevent PII exposure'"
