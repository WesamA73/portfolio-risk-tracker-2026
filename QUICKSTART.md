# Quick Start Guide

Get the Portfolio Risk Tracker running in 5 minutes!

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- A Supabase account ([Sign up free](https://supabase.com))

## Step 1: Clone & Install (2 min)

```bash
# Clone the repository
git clone <your-repo-url>
cd portfolio-risk-tracker-2026

# Install dependencies
npm install
```

## Step 2: Set Up Supabase (2 min)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** → **New Query**
3. Copy contents of `schema.sql`
4. Paste in SQL Editor and click **Run**
5. Get your API keys from **Settings** → **API**

## Step 3: Configure Environment (1 min)

```bash
# Copy example env file
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Step 4: Run Development Server (30 sec)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 🎯 Try It Out

1. **Add Assets**
   - Click "Analyze Portfolio"
   - Add some assets (stocks, bonds, etc.)
   - Click "Analyze Portfolio"

2. **View Results**
   - See your diversification score
   - Read personalized recommendations

3. **Save Results** (Optional)
   - Click "Sign Up to Save Results"
   - Create an account
   - Results are now saved to your dashboard!

## 📚 Next Steps

- Read full documentation in [README.md](README.md)
- See detailed setup in [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
- Review code structure in the `app/` directory

## 🐛 Troubleshooting

### Port 3000 already in use?
```bash
npm run dev -- -p 3001
```

### Build failing?
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Supabase connection issues?
- Double-check `.env.local` has correct values
- Ensure `schema.sql` was run
- Check Supabase project is active

## 💡 Tips

- Keep `.env.local` out of version control (it's in `.gitignore`)
- Use `npm run lint` to check code quality
- Use `npm run build` to create production build
- Check browser console (F12) for errors

## 🚀 Deploy to Production

When ready to deploy:

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy with one click!

See [README.md](README.md#-deployment) for details.

---

**Happy coding! 🎉**
