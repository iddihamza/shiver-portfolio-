# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/426da682-0b68-4ecd-8d50-865ff2644eae

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/426da682-0b68-4ecd-8d50-865ff2644eae) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Environment Variables

Create a `.env` file based on `.env.example` and provide the following values:

```
# Supabase project URL. If you are using the bundled project this will be
# `https://zcjtgmzzhfkolsjzwcsw.supabase.co`.
VITE_SUPABASE_URL=<your-supabase-url>

# Your Supabase project's "Anon" public API key. You can find it under
# **Project Settings › API** in the Supabase dashboard.
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

If these variables are missing at runtime the application will throw
`Supabase client not initialized` errors. Make sure to restart the dev server
after adding them.

## Applying database migrations

Whenever you add a file in `supabase/migrations/`, apply it to your project
by running:

```sh
supabase db push
```

## Public Cover Image URLs

Files uploaded to the `documents` bucket are publicly accessible. The base URL is:
`https://zcjtgmzzhfkolsjzwcsw.supabase.co/storage/v1/object/public/documents/`
Use this prefix followed by the file path from your upload result.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/426da682-0b68-4ecd-8d50-865ff2644eae) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
