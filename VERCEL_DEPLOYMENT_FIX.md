# Fix Vercel Deployment - Authentication Not Working

## Problem
Dashboard works on localhost but authentication fails on Vercel deployment.

## Root Cause
Vercel serverless functions **cannot access local file system** (SQLite files). Your `.env.local` file is also not deployed to Vercel. You need to:
1. Set up Turso (cloud database)
2. Add environment variables to Vercel

## Quick Fix (Step-by-Step)

### Step 1: Set Up Turso Database

```bash
# Install Turso CLI (if not already installed)
brew install tursodatabase/tap/turso

# Login to Turso
turso auth login

# Create database
turso db create truth-engine

# Get your database URL (copy this!)
turso db show truth-engine --url

# Create auth token (copy this too!)
turso db tokens create truth-engine
```

You should see output like:
```
URL: libsql://truth-engine-yourname.turso.io
Token: eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

### Step 2: Add Environment Variables to Vercel

**Option A: Using Vercel Dashboard (Recommended)**

1. Go to https://vercel.com/dashboard
2. Select your project (ryan-portfolio)
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar
5. Add these variables one by one:

| Name | Value | Environment |
|------|-------|-------------|
| `LIBSQL_URL` | `libsql://truth-engine-[yourname].turso.io` | Production, Preview, Development |
| `LIBSQL_AUTH_TOKEN` | `eyJhbGc...` (your token) | Production, Preview, Development |
| `GOOGLE_API_KEY` | `AIzaSyARDbkywZr0LNmK9ywv5GOquXutBTMUkw4` | Production, Preview, Development |
| `SESSION_SECRET` | Generate a strong random string | Production, Preview, Development |
| `ALLOW_REGISTRATION` | `true` | Production, Preview, Development |

**To generate a strong SESSION_SECRET:**
```bash
openssl rand -base64 32
```

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Add environment variables
vercel env add LIBSQL_URL
# Paste your Turso URL when prompted

vercel env add LIBSQL_AUTH_TOKEN
# Paste your Turso token when prompted

vercel env add GOOGLE_API_KEY
# Paste: AIzaSyARDbkywZr0LNmK9ywv5GOquXutBTMUkw4

vercel env add SESSION_SECRET
# Paste a strong random string

vercel env add ALLOW_REGISTRATION
# Type: true
```

### Step 3: Redeploy Your Application

**Option A: Trigger Redeploy from Dashboard**
1. Go to your Vercel project
2. Click **Deployments** tab
3. Click the three dots (...) on the latest deployment
4. Click **Redeploy**
5. Check "Use existing Build Cache" (optional)
6. Click **Redeploy**

**Option B: Push to Git**
```bash
git add .
git commit -m "Add Turso setup guide"
git push
```

**Option C: Using Vercel CLI**
```bash
vercel --prod
```

### Step 4: Test Your Deployment

1. Wait for deployment to complete (usually 1-2 minutes)
2. Visit your Vercel URL: `https://your-project.vercel.app/dashboard`
3. Try to register a new account
4. You should now be able to sign up and log in!

## Verification Checklist

- [ ] Turso database created
- [ ] Got LIBSQL_URL from Turso
- [ ] Got LIBSQL_AUTH_TOKEN from Turso
- [ ] Added all 5 environment variables to Vercel
- [ ] Redeployed the application
- [ ] Tested registration on Vercel URL
- [ ] Tested login on Vercel URL

## Common Issues & Solutions

### Issue 1: "Database access failed" on Vercel

**Solution:**
- Check that environment variables are set correctly in Vercel
- Make sure you selected "Production, Preview, Development" for all variables
- Redeploy after adding variables

### Issue 2: "Rate limit exceeded"

**Solution:**
- Wait 1 minute between attempts (auth is limited to 10 requests/minute)
- This is normal security behavior

### Issue 3: Environment variables not taking effect

**Solution:**
- Environment variables only apply to NEW deployments
- You MUST redeploy after adding/changing variables
- Clear browser cache and try again

### Issue 4: "Invalid token" or "Unauthorized" from Turso

**Solution:**
- Regenerate your Turso token:
  ```bash
  turso db tokens create truth-engine
  ```
- Update the `LIBSQL_AUTH_TOKEN` in Vercel
- Redeploy

### Issue 5: Still using local SQLite

**Solution:**
- Check your environment variables are named exactly:
  - `LIBSQL_URL` (not `DATABASE_URL`)
  - `LIBSQL_AUTH_TOKEN` (not `TURSO_AUTH_TOKEN`)
- Check for typos in variable names
- Redeploy

## How to Check If It's Working

### Check Vercel Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Click **Functions** tab
4. Click on any function (e.g., `api/auth`)
5. Look for logs - you should see successful database connections

### Check Turso Database

```bash
# Connect to your database
turso db shell truth-engine

# Check if tables exist
.tables

# Check if users are being created
SELECT * FROM users;

# Exit
.quit
```

## Quick Test Commands

```bash
# Test your Vercel deployment
curl -X POST https://your-project.vercel.app/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"register","email":"test@example.com","password":"testpass123"}'

# Should return: {"registered":true,"userId":1}
# Or an error message if something is wrong
```

## Environment Variables Summary

Here's what each variable does:

| Variable | Purpose | Where to Get It |
|----------|---------|-----------------|
| `LIBSQL_URL` | Turso database connection URL | `turso db show truth-engine --url` |
| `LIBSQL_AUTH_TOKEN` | Authentication for Turso | `turso db tokens create truth-engine` |
| `GOOGLE_API_KEY` | AI autofill feature | Google Cloud Console (already have it) |
| `SESSION_SECRET` | Secure session cookies | Generate with `openssl rand -base64 32` |
| `ALLOW_REGISTRATION` | Enable/disable new signups | `true` or `false` |

## After Successful Deployment

Once everything works:

1. ✅ Register your own account on production
2. ✅ Create your profile
3. ✅ Claim your handle (e.g., `@ryan`)
4. ✅ Publish your profile
5. ✅ Share your public URL: `https://your-project.vercel.app/u/ryan`

## Security Notes

- Never commit `.env.local` to Git (it's in `.gitignore`)
- Keep your `LIBSQL_AUTH_TOKEN` secret
- Use a strong `SESSION_SECRET` in production
- Consider setting `ALLOW_REGISTRATION=false` after you create your account to prevent others from using your API quota

## Need Help?

If you're still having issues:

1. Check Vercel function logs for specific error messages
2. Verify all environment variables are set correctly
3. Make sure you redeployed after adding variables
4. Test Turso connection locally first with the same credentials
5. Check that your Turso database is active: `turso db list`

## Turso Free Tier Limits

Your free tier includes:
- 500 databases
- 9 GB total storage
- 1 billion row reads/month
- 25 million row writes/month

This is more than enough for a personal portfolio site!
