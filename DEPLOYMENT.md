# Deployment Guide

This guide explains how to deploy the Mini-Marketplace to Vercel.

## Prerequisites

- A GitHub repository containing your code.
- A Vercel account.
- A Supabase project.

## Steps

1. **Push to GitHub**
   - Initialize a git repository if you haven't already:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     ```
   - Create a new repository on GitHub and push your code.

2. **Deploy to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard).
   - Click **"Add New..."** -> **"Project"**.
   - Import your GitHub repository.

3. **Configure Environment Variables**
   - In the Vercel deployment configuration, expand the **"Environment Variables"** section.
   - Add the following variables (copy values from your Supabase project settings):
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Deploy**
   - Click **"Deploy"**.
   - Vercel will build and deploy your application.

5. **Supabase URL Configuration**
   - Once deployed, copy your Vercel URL (e.g., `https://mini-marketplace.vercel.app`).
   - Go to your Supabase Dashboard -> Authentication -> URL Configuration.
   - Add your Vercel URL to **Site URL** and **Redirect URLs**.

## Verification

- Visit your deployed URL.
- Try signing up, logging in, and listing a product to ensure everything works in production.
