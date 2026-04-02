# Sticker Orbit

Static sticker website with:

- sticker type catalog
- built-in live sticker inventory
- custom photo upload
- Supabase-ready auth with local fallback
- funny, cute, comic, retro, and neon sticker presets
- AI-style photo sticker transforms
- real-time editable starter stickers
- browser-based sticker rendering on canvas
- gallery save/load
- PNG download
- offline support through a service worker

## Free deployment

You can host this for free on:

- GitHub Pages
- Netlify
- Vercel

## Deploy

This project is a plain static site. Deploy the contents of `D:\sticker` directly.

GitHub Pages:

1. Push the folder contents from `D:\sticker` to a repository root.
2. Keep the included `.nojekyll` file.
3. Enable Pages from the default branch.

Netlify:

1. Create a new site from a repo or drag-and-drop the folder.
2. Set the publish directory to the project root for `D:\sticker`.
3. No build command is needed.

Vercel:

1. Import the folder or repository containing `D:\sticker`.
2. Framework preset can stay as `Other`.
3. No build command is needed.

## Real Auth Setup

This site supports two auth modes:

- local browser account fallback
- Supabase cloud auth when configured

To enable real cloud accounts:

1. Create a Supabase project.
2. In Supabase, enable Email auth.
3. Open `D:\sticker\supabase-config.js`.
4. Fill in:
   - `url`
   - `anonKey`
   - `redirectUrl`
5. Deploy again.

After that, sign up and sign in will use Supabase instead of browser-only storage.

## Notes

- No backend is required.
- Photo processing happens in the browser.
- Saved gallery items are stored in browser local storage.
- If you change cached assets, bump the cache name in `sw.js`.
