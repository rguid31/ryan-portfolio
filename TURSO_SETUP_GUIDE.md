# Turso Database Setup Guide

## Problem
You're seeing authentication errors because the app is trying to use local SQLite, which doesn't work reliably in serverless environments or may have permission issues.

## Solution: Set Up Turso (Cloud Database)

### Step 1: Install Turso CLI

```bash
# macOS
brew install tursodatabase/tap/turso

# Or using curl
curl -sSfL https://get.tur.so/install.sh | bash
```

### Step 2: Sign Up and Login

```bash
# Sign up (opens browser)
turso auth signup

# Or login if you already have an account
turso auth login
```

### Step 3: Create Your Database

```bash
# Create a new database called "truth-engine"
turso db create truth-engine

# Get the database URL
turso db show truth-engine --url

# Create an auth token
turso db tokens create truth-engine
```

### Step 4: Update Your .env.local File

Copy the URL and token from the previous commands and update your `.env.local`:

```bash
# Replace these with your actual Turso credentials
LIBSQL_URL="libsql://truth-engine-[your-username].turso.io"
LIBSQL_AUTH_TOKEN="eyJhbGc..."

# Keep these existing settings
GOOGLE_API_KEY=AIzaSyARDbkywZr0LNmK9ywv5GOquXutBTMUkw4
SESSION_SECRET="change-this-to-a-secure-random-string"
ALLOW_REGISTRATION=true

# You can remove or comment out DATABASE_URL (not used anymore)
# DATABASE_URL="file:./data/truth-engine.db"
```

### Step 5: Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

### Step 6: Test Authentication

1. Go to http://localhost:3000/dashboard
2. Try to register a new account
3. You should now be able to sign up and log in successfully

## Verification

To verify Turso is working:

```bash
# Check your database has tables
turso db shell truth-engine

# In the shell, run:
.tables

# You should see:
# handles  profile_drafts  profile_snapshots  search_index  sessions  users

# Exit the shell
.quit
```

## Troubleshooting

### Error: "turso: command not found"
- Make sure you installed the CLI correctly
- Try closing and reopening your terminal
- Check if it's in your PATH: `which turso`

### Error: "Database access failed"
- Double-check your `LIBSQL_URL` and `LIBSQL_AUTH_TOKEN` in `.env.local`
- Make sure there are no extra spaces or quotes
- Restart your dev server after changing environment variables

### Error: "Rate limit exceeded"
- Wait 1 minute and try again
- The auth endpoint has a 10 requests/minute limit

### Tables not created automatically
- The migration runs automatically on first API call
- If it fails, you can manually create tables using the Turso shell:

```bash
turso db shell truth-engine < lib/truth-engine/schema.sql
```

## For Production (Vercel Deployment)

When deploying to Vercel:

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add these variables:
   - `LIBSQL_URL`: Your Turso database URL
   - `LIBSQL_AUTH_TOKEN`: Your Turso auth token
   - `GOOGLE_API_KEY`: Your Google API key
   - `SESSION_SECRET`: A strong random string
   - `ALLOW_REGISTRATION`: `true` or `false`

4. Redeploy your application

## Cost

Turso has a generous free tier:
- 500 databases
- 9 GB total storage
- 1 billion row reads per month
- Perfect for development and small production apps

## Next Steps After Setup

Once Turso is working:

1. ✅ Test registration and login
2. ✅ Create your profile in the dashboard
3. ✅ Test the publish feature
4. ✅ Check your public profile at `/u/[your-handle]`
5. ✅ Deploy to Vercel with Turso credentials

## Alternative: Keep Using Local SQLite (Development Only)

If you want to stick with local SQLite for now (not recommended for production):

1. Make sure the `data` directory exists:
   ```bash
   mkdir -p data
   ```

2. Check file permissions:
   ```bash
   chmod 755 data
   ```

3. Make sure you're not running on Vercel or another serverless platform

However, **Turso is strongly recommended** because:
- Works in serverless environments (Vercel, Netlify, etc.)
- No file system issues
- Better performance
- Automatic backups
- Free tier is generous
