# Deployment guide — MFI Loan Calculator

Two ways to get the project online. **Path A is fastest (about 5 minutes, no
Git needed). Path B is recommended for your CV** because employers will want to
see the source code on GitHub. You can start with A today and do B later — the
site will look identical.

Files you need from the workspace:

- `mfi-loan-calculator-site.zip` — the built website (for Path A)
- `mfi-loan-calculator.zip` — the full source code (for Path B / GitHub)

---

## PATH A — Go live in 5 minutes with Netlify Drop

1. Open **https://app.netlify.com/drop** in your browser (works on laptop or
   phone; sign up free with your Gmail if prompted).
2. Unzip `mfi-loan-calculator-site.zip` — you get a folder named **`dist`**.
3. Drag the **`dist` folder** onto the Netlify Drop page.
4. Wait a few seconds. Netlify gives you a live URL like
   `https://sparkling-name-12345.netlify.app`.
5. Click **Site settings → Change site name** to rename it to something clean,
   e.g. `amaranang-loan-calculator.netlify.app`.

That URL is already shareable and can go on your CV. The project's
`netlify.toml` (inside the source) handles future GitHub deploys automatically.

---

## PATH B — GitHub + Vercel (recommended for the CV)

### Step 1 — Create the GitHub repository

1. Sign in at **https://github.com** (create a free account if needed).
2. Click your profile icon area → **New repository**.
3. Name: `mfi-loan-calculator` · leave it **Public** · do **not** add a README
   or license (the project already has them) → **Create repository**.
4. On the next page, click the link **"uploading an existing file"**.
5. Unzip `mfi-loan-calculator.zip`, open the `loan-calculator` folder, select
   **everything inside it** and drag it onto the upload page.
6. Click **Commit changes**.

### Step 2 — Deploy on Vercel

1. Go to **https://vercel.com** and sign up **with your GitHub account**
   (free, no credit card).
2. Click **Add New → Project**.
3. Find `mfi-loan-calculator` in the list and click **Import**.
4. Vercel auto-detects Vite. Do not change anything:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
5. Click **Deploy**. In about a minute you get a permanent URL like
   `https://mfi-loan-calculator.vercel.app`.

Every time you update the code on GitHub, Vercel redeploys automatically.

### Alternative: deploy the same GitHub repo on Netlify

**Add new site → Import an existing project → pick the repo** · build command
`npm run build` · publish directory `dist` → **Deploy site**.

---

## After deploying — send these two links back

1. **Live demo URL** (Vercel or Netlify)
2. **GitHub repository URL** (e.g. `https://github.com/your-username/mfi-loan-calculator`)

The CV will be regenerated with both links in the contact header and the
project entry from `CV_PROJECT_ENTRY.md`.

## Troubleshooting

- **Vercel says "build failed":** open the build log and check it ran
  `npm run build`; the repo must contain `package.json` at its top level (do
  not upload the outer `loan-calculator` folder itself as a nested folder —
  upload its *contents*).
- **Page is blank after deploy:** the output directory must be `dist`, not the
  project root.
- **Netlify Drop shows a file list instead of the app:** you dragged the wrong
  folder — drag the unzipped **`dist`** folder, not the source folder.
- **Phone-only uploads:** GitHub's web upload works on Android Chrome with
  "desktop site" enabled; if it's awkward, do Path A first (Netlify Drop works
  well on mobile) and GitHub later from a laptop.
