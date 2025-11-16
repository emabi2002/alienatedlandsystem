# 🚀 Netlify Deployment Guide

## ✅ Configuration Fixed!

The "Page not found" error has been fixed. The issue was that the Netlify Next.js plugin was being skipped.

**Latest commit pushed to GitHub**: Fix Netlify deployment configuration

---

## 🔧 How to Deploy to Netlify

### Method 1: Redeploy Existing Site (Recommended)

If you already connected your GitHub repo to Netlify:

1. **Go to your Netlify dashboard**
2. **Find your site**
3. **Click "Trigger deploy" → "Clear cache and deploy site"**
4. The new configuration will be pulled from GitHub automatically
5. Wait for the build to complete (~2-3 minutes)
6. Your site should now work! 🎉

### Method 2: Fresh Deployment

If you haven't connected yet, or want to start fresh:

#### Step 1: Create New Site on Netlify

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Authorize Netlify to access your GitHub account
5. Select repository: `emabi2002/alienatedlandsystem`

#### Step 2: Configure Build Settings

Netlify should auto-detect Next.js settings. Verify:

- **Build command**: `npm install && npm run build`
- **Publish directory**: Leave empty (plugin handles it)
- **Base directory**: Leave empty

Click "Show advanced" if you need to set environment variables now, or do it later.

#### Step 3: Add Environment Variables

**CRITICAL**: Add these before deploying:

1. Click "Site settings" → "Environment variables"
2. Add the following:

```
NEXT_PUBLIC_SUPABASE_URL
Value: https://yvnkyjnwvylrweyzvibs.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bmt5am53dnlscndleXp2aWJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3Mjg4NTMsImV4cCI6MjA3NzMwNDg1M30.dqZtNCoHekiN_qfxdZMMh_fKB9kJKzlDktykvAU2QEk

SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bmt5am53dnlscndleXp2aWJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTcyODg1MywiZXhwIjoyMDc3MzA0ODUzfQ.WhJB6KcKefnLAPJqPbvRh2MsVUAZOWHRkKahT2-ERNY
```

3. Click "Save"

#### Step 4: Deploy!

1. Click "Deploy site"
2. Wait for build to complete
3. Once deployed, click on the site URL to test

---

## 🎯 Expected Build Output

You should see in the Netlify build log:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (12/12)
✓ Build complete
```

**Build time**: ~2-3 minutes

---

## 🔍 Troubleshooting

### Issue: Build fails with "command not found: bun"

**Solution**: The new config uses `npm` instead of `bun`. Make sure you redeployed after pulling the latest changes.

### Issue: Still getting "Page not found"

**Checklist**:
1. ✅ Cleared cache and redeployed?
2. ✅ Environment variables set?
3. ✅ Using latest code from GitHub (commit 60fd18f or later)?
4. ✅ Build completed successfully?

**Fix**:
- Go to "Site settings" → "Build & deploy" → "Build settings"
- Make sure Build command is: `npm install && npm run build`
- Make sure Publish directory is empty or not set
- Click "Save"
- Trigger a new deploy with cache cleared

### Issue: Build succeeds but site shows errors

**Likely cause**: Environment variables not set

**Fix**:
1. Go to "Site settings" → "Environment variables"
2. Add all three Supabase variables (see Step 3 above)
3. Redeploy the site

### Issue: Some features not working

**Check**:
1. Did you run the database migrations in Supabase? (See `.same/MIGRATION_FIX.sql`)
2. Are all views created? (provinces_view, land_parcels_view, etc.)
3. Is the database accessible from the internet?

---

## 📊 What the Fixed netlify.toml Does

```toml
[build]
  command = "npm install && npm run build"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Changes made**:
- ❌ Removed `NETLIFY_NEXT_PLUGIN_SKIP = "true"` (was disabling the plugin!)
- ❌ Removed `publish = ".next"` (plugin handles this automatically)
- ✅ Changed to `npm install && npm run build` for compatibility
- ✅ Plugin now properly enabled

The `@netlify/plugin-nextjs` automatically:
- Handles server-side rendering
- Sets up Netlify Functions for API routes
- Configures redirects
- Optimizes the build output
- Handles dynamic routes

---

## 🎉 Success Indicators

Once deployed successfully, you should be able to:

1. ✅ Access the homepage (Dashboard)
2. ✅ Navigate to all pages via the sidebar
3. ✅ See the green emerald theme
4. ✅ Dashboard shows statistics (if migrations run)
5. ✅ Submit Request form loads (if migrations run)
6. ✅ Applications page shows data (if migrations run)

---

## 🔗 Useful Netlify Links

- **Netlify Dashboard**: https://app.netlify.com/
- **Next.js Plugin Docs**: https://docs.netlify.com/integrations/frameworks/next-js/
- **Build Logs**: Site → Deploys → Click latest deploy
- **Environment Vars**: Site → Site settings → Environment variables

---

## 📝 Post-Deployment Checklist

After successful deployment:

- [ ] Site loads without 404 error
- [ ] Environment variables are set
- [ ] Dashboard displays correctly
- [ ] All navigation links work
- [ ] Run database migrations (if not done yet)
- [ ] Test GIS mapping (requires migrations)
- [ ] Test form submission
- [ ] Verify data loads from Supabase

---

## 🆘 Still Having Issues?

1. Check Netlify build logs: Site → Deploys → Latest deploy → Show build log
2. Check browser console for errors (F12)
3. Verify environment variables are set correctly
4. Make sure you're using the latest code (commit 60fd18f or later)
5. Try clearing Netlify cache and redeploying

---

**Updated**: November 16, 2025
**Latest Commit**: 60fd18f - Fix Netlify deployment configuration
**Status**: ✅ Fixed and ready to deploy
