# Mini-Marketplace

A clean, production-ready mini-marketplace built with React, Vite, TailwindCSS, and Supabase.

## Features

- **Authentication**: Sign up and Log in with email/password.
- **Sell Products**: List items for sale with images (stored in Supabase Storage).
- **Browse Products**: View all listed products in a responsive grid.
- **Product Details**: View seller information in a modal.
- **Responsive Design**: Fully responsive UI using TailwindCSS.

## Tech Stack

- **Frontend**: React, Vite, React Router
- **Styling**: TailwindCSS, Lucide React (Icons)
- **Backend**: Supabase (Auth, Database, Storage)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mini-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Create a new Supabase project.
   - Run the SQL scripts provided in `supabase_schema.sql` in your Supabase SQL Editor to set up tables and RLS policies.
   - Create a storage bucket named `product-images` and set it to public.

4. **Environment Variables**
   - Create a `.env` file in the root directory.
   - Add your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
