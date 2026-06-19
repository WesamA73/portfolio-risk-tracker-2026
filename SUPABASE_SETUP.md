# Supabase Integration Guide

This guide explains how to set up Supabase authentication and database integration for the Portfolio Risk Tracker.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Fill in project details:
   - Name: `portfolio-risk-tracker`
   - Database Password: Create a strong password (save this!)
   - Region: Choose closest to you
4. Wait for project to initialize (5-10 minutes)

## Step 2: Initialize Database

1. Go to **SQL Editor** in your Supabase project
2. Click **New Query**
3. Copy the entire contents of `schema.sql` from the project root
4. Paste it into the SQL Editor
5. Click **Run**

This creates:
- `users` table (auto-managed by Supabase Auth)
- `portfolios` table (stores portfolio data)
- `assets` table (stores individual assets)
- Row Level Security (RLS) policies

## Step 3: Get API Keys

1. Go to **Project Settings** → **API**
2. Find and copy:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 4: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## Step 5: Create Client Utilities

Create `lib/supabaseClient.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## Step 6: Implement Authentication

### Sign Up
```typescript
import { supabase } from '@/lib/supabaseClient';

const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: {
      full_name: formData.fullName,
    },
  },
});

if (error) {
  // Handle error
} else {
  // User created, redirect to verify email
  window.location.href = '/auth/verify-email';
}
```

### Log In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: formData.email,
  password: formData.password,
});

if (error) {
  // Handle error
} else {
  // Logged in successfully
  window.location.href = '/dashboard';
}
```

### Get Current User
```typescript
const { data: { user }, error } = await supabase.auth.getUser();

if (user) {
  console.log('Logged in as:', user.email);
} else {
  console.log('Not logged in');
}
```

## Step 7: Save Portfolio

```typescript
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  console.error('User not authenticated');
  return;
}

// Create portfolio
const { data: portfolio, error: portfolioError } = await supabase
  .from('portfolios')
  .insert([
    {
      user_id: user.id,
      name: 'My Portfolio',
    },
  ])
  .select()
  .single();

if (portfolioError) {
  console.error('Error creating portfolio:', portfolioError);
  return;
}

// Add assets
const { error: assetsError } = await supabase
  .from('assets')
  .insert(
    assets.map(asset => ({
      portfolio_id: portfolio.id,
      asset_name: asset.name,
      asset_type: asset.type,
    }))
  );

if (assetsError) {
  console.error('Error adding assets:', assetsError);
}
```

## Step 8: Fetch User's Portfolios

```typescript
const { data: { user } } = await supabase.auth.getUser();

const { data: portfolios, error } = await supabase
  .from('portfolios')
  .select(
    `
    id,
    name,
    created_at,
    assets (
      id,
      asset_name,
      asset_type
    )
    `
  )
  .eq('user_id', user?.id)
  .order('created_at', { ascending: false });

if (error) {
  console.error('Error fetching portfolios:', error);
} else {
  console.log('User portfolios:', portfolios);
}
```

## Step 9: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. Go to **Email Templates**
4. Customize signup and reset password emails (optional)

## Step 10: Row Level Security (RLS)

The schema.sql file includes RLS policies. They ensure:
- Users can only view their own data
- Users can only insert data for themselves
- Users can only update/delete their own data

To verify RLS is enabled:
1. Go to **SQL Editor**
2. Run:
   ```sql
   SELECT tablename FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename IN ('users', 'portfolios', 'assets');
   ```

## Troubleshooting

### "Cannot find project API keys"
- Ensure you're in the correct Supabase project
- Check API section under Project Settings
- Verify keys are not empty

### "Row-level security is disabled"
- Run the RLS enable commands from schema.sql
- Or re-run the entire schema.sql file

### "Users can see other users' data"
- Verify RLS policies are in place
- Check the policies use correct auth.uid()
- Restart your development server

### "Auth.getUser() returns null"
- User might not be logged in
- Check localStorage for session data
- Verify Supabase Auth is enabled in project

## Environment Variables Checklist

```
✓ NEXT_PUBLIC_SUPABASE_URL=your_url
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
✓ Database initialized with schema.sql
✓ Email provider enabled
✓ RLS policies in place
```

## Next Steps

1. Replace placeholder auth calls in signup and login pages
2. Add middleware for protected routes
3. Create email verification flow
4. Implement password reset flow
5. Add session management
6. Deploy to Vercel

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
