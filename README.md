# Maqal 🎧📚

**Maqal** is a modern audiobook web app focused on meaningful listening — stories, knowledge, and culture delivered through audio.

Built with **Next.js** and **Supabase**, Maqal lets users discover audiobooks, stream chapters securely, and continue listening anytime, anywhere.

---

## ✨ Features
- User authentication (Supabase Auth)
- Browse and listen to audiobooks
- Chapter-based audio playback
- Resume listening progress
- Secure audio streaming with signed URLs
- Clean, modern UI
- Mobile-friendly design

---

## 🛠 Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Supabase (Postgres, Auth, Storage)
- **Audio Storage:** Supabase Storage (private buckets)

---

## 🚀 Getting Started
1. Clone the repository  
2. Install dependencies  
   ```bash
   npm install
   ```
3. Run the development server
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 📝 Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
