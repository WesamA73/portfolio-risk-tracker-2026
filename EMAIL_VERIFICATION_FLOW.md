# Email Verification & Portfolio Saving Flow

## Overview

When a user signs up, they now follow this flow:

1. **Enter Portfolio** → Analyze → See Results
2. **Decision Modal** → "Sign Up to Save Results"
3. **Signup Form** → Enter name, email, password
4. **Email Verification** → Enter 6-digit code
5. **Portfolio Saved** → Redirect to Dashboard

## Current Implementation

The flow is built with placeholders for Supabase integration. Here's what's implemented:

### 1. Portfolio Results (Home Page)
- User enters assets and gets diversification score
- `GuestSignupModal` appears with two options
- Portfolio data is stored in `localStorage` when "Sign Up" is clicked

### 2. Signup Page (`/auth/signup`)
- Accepts: Full Name, Email, Password, Password Confirmation
- Validates all fields
- Stores email in localStorage
- Redirects to verification page with email parameter

### 3. Email Verification Page (`/auth/verify-email`)
- Displays stored email address
- Input field for 6-digit verification code
- "Resend Code" button with 60-second cooldown
- After verification, saves portfolio and redirects to dashboard

### 4. Forgot Password Page (`/auth/forgot-password`)
- Email-based password reset
- Confirmation screen after sending

## Data Flow

```
Portfolio Data
    ↓
localStorage["pending_portfolio"]
    ↓
Signup → Email Verification
    ↓
localStorage.removeItem("pending_portfolio")
    ↓
Dashboard (data saved to Supabase)
```

## Integration with Supabase

To fully implement this flow with Supabase:

### Step 1: Update Signup Page

In `/app/auth/signup/page.tsx`, replace the TODO comment:

```typescript
import { supabase } from '@/lib/supabaseClient';

const handleSubmit = async (e: React.FormEvent) => {
  // ... validation code ...

  try {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/verify-email`,
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
    localStorage.setItem("signup_email", formData.email);
    
    setTimeout(() => {
      window.location.href = `/auth/verify-email?email=${encodeURIComponent(formData.email)}`;
    }, 1500);
  } catch (err) {
    setError("Failed to create account. Please try again.");
  }
};
```

### Step 2: Update Email Verification Page

In `/app/auth/verify-email/page.tsx`, replace the TODO comment:

```typescript
import { supabase } from '@/lib/supabaseClient';

const handleVerify = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  if (!code.trim()) {
    setError("Please enter the verification code");
    setLoading(false);
    return;
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'signup',
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // User is now verified, save portfolio if exists
    const portfolioData = localStorage.getItem("pending_portfolio");
    if (portfolioData && data.user) {
      const portfolio = JSON.parse(portfolioData);
      
      // Save portfolio to database
      const { error: saveError } = await supabase
        .from('portfolios')
        .insert([
          {
            user_id: data.user.id,
            name: 'Initial Analysis',
          },
        ])
        .select()
        .single();

      if (!saveError) {
        localStorage.removeItem("pending_portfolio");
      }
    }

    setSuccess(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);
  } catch (err) {
    setError("Invalid verification code. Please try again.");
  } finally {
    setLoading(false);
  }
};

const handleResendCode = async () => {
  setLoading(true);
  setError("");

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      setError(error.message);
    } else {
      setResendCountdown(60);
    }
  } catch (err) {
    setError("Failed to resend code. Please try again.");
  } finally {
    setLoading(false);
  }
};
```

### Step 3: Create Supabase Client

Create `/lib/supabaseClient.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Step 4: Configure Email Templates (in Supabase)

1. Go to **Authentication** → **Email Templates**
2. Customize the OTP template to include the 6-digit code
3. Set email to send from a verified domain

## Testing the Flow

### Without Supabase
1. Open browser DevTools → Application → Local Storage
2. Watch as data is stored/removed during signup flow
3. Verification page simulates successful verification

### With Supabase
1. Complete signup
2. Check email for verification code
3. Enter code to verify
4. Portfolio automatically saved
5. Redirect to dashboard with saved data

## Troubleshooting

### "Verification code not working"
- Check code is exactly 6 digits
- Verify code matches email sent
- Check code hasn't expired (usually 24 hours)
- Try "Resend Code" button

### "Portfolio data lost after verification"
- Check `pending_portfolio` exists in localStorage
- Verify user ID from Supabase response
- Check database `portfolios` table for inserted data

### "Email not received"
- Check spam/junk folder
- Verify email address is correct
- In Supabase, ensure SMTP is configured
- Check email domain is verified

## localStorage Keys

- `pending_portfolio`: JSON string of portfolio results
- `signup_email`: User's email during signup flow

These are cleared after successful portfolio saving.

## Security Notes

- Portfolio data in localStorage is visible in DevTools
- Only use for temporary storage during signup
- Remove from localStorage immediately after saving to database
- HTTPS required in production
- Verification codes should expire after 24 hours
- Rate limit OTP resend attempts

## Next Features

- [ ] Save multiple portfolios
- [ ] Edit existing portfolios
- [ ] Portfolio history/timeline
- [ ] Two-factor authentication
- [ ] Social login (Google, GitHub)
- [ ] Session persistence across page reloads
