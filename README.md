# Sticker Orbit

Static sticker website with:

- multipage product flow
- landing page, explore page, studio page, and AI agent page
- sticker type catalog
- built-in live sticker inventory
- custom photo upload
- Supabase-ready auth with a demo-only local fallback
- funny, cute, comic, retro, and neon sticker presets
- AI-style photo sticker transforms
- OpenAI Responses API-ready AI agent with offline fallback on static hosting
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

Best recommendation:

- GitHub Pages for the static-only version with offline agent mode
- Vercel for the public AI-agent version because the OpenAI key can live on the server

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

- local browser account fallback for demo use
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

Important:

- The local browser account mode is only for demo use on a static deployment.
- Do not treat browser-local accounts as production authentication.

## AI Agent Setup

The AI agent page is separated at `agent.html`.

Without any API key:

- the page runs in offline creative mode
- it still gives sticker captions, pack ideas, and prompt-based guidance
- no setup is required

On GitHub Pages specifically:

- `/api/agent` is not available
- the agent will stay in offline creative mode unless you deploy to a server platform

To enable safe public AI responses on Vercel:

1. Deploy the project to Vercel.
2. Add an environment variable named `OPENAI_API_KEY`.
3. Keep `window.STICKER_ORBIT_OPENAI.preferProxy = true` in `openai-config.js`.
4. The agent page will call the server-side endpoint at `/api/agent`.

To enable owner-only browser testing:

1. Open `D:\sticker\openai-config.js`.
2. Add your OpenAI API key and preferred model, or paste a key into the agent page at runtime.
3. Use this only for private testing.

Important:

- A frontend-only site should not expose a permanent production API key to all visitors.
- This repo already includes a Vercel-style serverless proxy at `D:\sticker\api\agent.js`.

## Notes

- No backend is required.
- Photo processing happens in the browser.
- Saved gallery items are stored in browser local storage.
- If you change cached assets, bump the cache name in `sw.js`.
