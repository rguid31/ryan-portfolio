# Vercel Environment Variables - Ready to Copy

## Your Turso Credentials

Copy these exact values into Vercel:

### 1. LIBSQL_URL
```
libsql://truth-engine-rguid31.aws-us-east-1.turso.io
```

### 2. LIBSQL_AUTH_TOKEN
```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDA3MTU4NzEsImlkIjoiODQzODNlMmYtNGJlYS00YjdlLTgwNmQtZjRmOGI1Zjk4YTM5IiwicmlkIjoiNmE5NTk3YzgtYjI0NS00YzA1LTk4YjEtZGE1Y2I2NzI2MWJlIn0.yK6ivX39i4_BAHRuM4Z5QKfhMbRPa4RZ_0v9vD9QpYJ97XXYRZOftG7NZSZlTx0y_fZaZADfgUzb477lpz5QAg
```

### 3. GOOGLE_API_KEY
```
AIzaSyARDbkywZr0LNmK9ywv5GOquXutBTMUkw4
```

### 4. SESSION_SECRET
```
Generate a new one with: openssl rand -base64 32
Or use this one: Kx9mP2vN8qR5tY7wZ3aB6cD4eF1gH0iJ
```

### 5. ALLOW_REGISTRATION
```
true
```

---

## Quick Setup Steps

### Option 1: Vercel Dashboard (Easiest)

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Add each variable above (copy-paste the values)
5. For each variable, select: **Production, Preview, Development**
6. Click **Save**
7. Go to **Deployments** tab
8. Click **Redeploy** on the latest deployment

### Option 2: Vercel CLI (Fastest)

Run these commands in your terminal:

```bash
# Make sure you're in the project directory
cd /Users/ryanguidry/ryan-portfolio

# Add environment variables
vercel env add LIBSQL_URL production
# Paste: libsql://truth-engine-rguid31.aws-us-east-1.turso.io

vercel env add LIBSQL_AUTH_TOKEN production
# Paste the token above

vercel env add GOOGLE_API_KEY production
# Paste: AIzaSyARDbkywZr0LNmK9ywv5GOquXutBTMUkw4

vercel env add SESSION_SECRET production
# Generate with: openssl rand -base64 32

vercel env add ALLOW_REGISTRATION production
# Type: true

# Deploy
vercel --prod
```

---

## Test After Deployment

1. Visit your Vercel URL: `https://[your-project].vercel.app/dashboard`
2. Try to register a new account
3. Should work now! ✅

---

## Verify Database Connection

Check if tables were created in Turso:

```bash
turso db shell truth-engine
```

Then in the shell:
```sql
.tables
SELECT * FROM users;
.quit
```

---

## Troubleshooting

### If it still doesn't work:

1. **Check Vercel logs:**
   - Go to Vercel Dashboard → Deployments → Latest → Functions
   - Look for error messages

2. **Verify environment variables:**
   ```bash
   vercel env ls
   ```

3. **Make sure you redeployed:**
   - Environment variables only apply to NEW deployments
   - You must redeploy after adding them

4. **Test locally with Turso:**
   - Update your `.env.local` with the Turso credentials above
   - Run `npm run dev`
   - Test at http://localhost:3000/dashboard
   - If it works locally with Turso, it will work on Vercel

---

## Security Note

⚠️ **Keep these credentials private!**
- Don't commit this file to Git
- Don't share your auth token publicly
- Consider regenerating the token if exposed

---

## After It Works

Once authentication works on Vercel:

1. ✅ Register your account
2. ✅ Create your profile
3. ✅ Claim your handle (e.g., `@ryan`)
4. ✅ Publish your profile
5. ✅ Share: `https://[your-project].vercel.app/u/ryan`

Optional: Set `ALLOW_REGISTRATION=false` to prevent others from signing up.
