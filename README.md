# patrik@barsi.xyz

Personal website for Patrik Barsi — a terminal / shell themed site built with
[Astro](https://astro.build). Tokyo Night colour scheme, an interactive shell on
the home page, and a plain clickable page for every section so it works with or
without JavaScript.

## Stack

| Piece            | Choice                                                    |
| ---------------- | -------------------------------------------------------- |
| Framework        | Astro 5 (static output, zero client JS by default)       |
| Interactive bit  | ~4 KB of hand-written TypeScript, no runtime framework    |
| Styling          | One plain CSS file with custom properties (`src/styles/global.css`) |
| Font             | JetBrains Mono via Google Fonts, with a monospace fallback stack |
| Hosting          | Netlify (`netlify.toml` included)                        |

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site -> dist/
npm run preview    # serve the built dist/ locally
```

## Editing your content

**Everything lives in one file: `src/data/site.ts`.**
Profile, education, experience, skills and projects are plain typed objects.
Both the static pages and the interactive shell read from there, so you only
edit it once.

Things you will likely want to change first:

- `profile.socials.linkedin` — still a placeholder (`linkedin.com/in/patrik-barsi`);
  put your real profile URL here. GitHub (`github.com/bpxtrik`) is set.
- `education[0].degree` — the MSc is listed as plain "Master of Science"; add the
  programme / specialisation name when you want it shown.
- `astro.config.mjs` → `site` is set to `https://barsi.xyz`. If you deploy to a
  Netlify subdomain first, point it (and `public/robots.txt`) there until the
  custom domain is live.

## The shell

The command set is defined in `src/lib/shell.ts`. Available commands:
`help`, `about`, `whoami`, `experience`, `education`, `skills`, `projects`,
`open <project>`, `contact`, `github`, `linkedin`, `neofetch`, `ls`, `clear`,
`cd <section>` (plus a few hidden ones: `pwd`, `date`, `echo`, `sudo`, `exit`).

- <kbd>Tab</kbd> completes commands and project names
- <kbd>↑</kbd>/<kbd>↓</kbd> walk command history
- <kbd>Ctrl</kbd>+<kbd>L</kbd> clears the screen
- `?cmd=projects` in the URL runs a command on load

Output is built as escaped, coloured tokens (not raw HTML), so the same
definitions render server-side for the no-JS transcript and client-side in the
live shell without any injection surface.

## Deploying to Netlify

1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket).
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Build settings are picked up from `netlify.toml`
   (`npm run build`, publish `dist`). Nothing to configure.
4. After the first deploy, copy the site URL into `astro.config.mjs` `site`
   and into `public/robots.txt`, then commit.

No adapter or serverless functions — it is a fully static build.

## Adding a downloadable CV later

Drop the PDF into `public/` (e.g. `public/Patrik_Barsi.pdf`) and add a `cv`
command in `src/lib/shell.ts` that returns a `nav` to `/Patrik_Barsi.pdf`,
plus a link on `src/pages/contact.astro`.
