# Uploading the project to GitHub from VS Code

## One-time setup (only needed once on your computer)

1. **Install Git** from https://git-scm.com/downloads (accept all default
   options during installation). Restart VS Code after installing.
2. **Install Node.js LTS** from https://nodejs.org (needed to run the project
   locally; Git is the only hard requirement for the upload).
3. Create a free GitHub account at https://github.com if you don't have one.
4. In VS Code, sign in: click the **Accounts** icon (bottom-left corner,
   person silhouette) → **Sign in to use GitHub** → a browser tab opens →
   authorize VS Code. (If you don't see this option, install the free
   **GitHub Pull Requests and Issues** extension by GitHub, then retry.)

## Part 1 — Get the project open in VS Code

1. Download `mfi-loan-calculator.zip` and unzip it. You get a folder named
   **`loan-calculator`** (this folder contains `package.json`).
2. VS Code → **File → Open Folder…** → select that `loan-calculator` folder.
   ⚠️ Open the folder that directly contains `package.json` — not its parent.
3. Open the integrated terminal (**Terminal → New Terminal**, or Ctrl+`) and run:

   ```bash
   npm install
   npm run dev
   ```

   The app opens at http://localhost:5173. Stop it with Ctrl+C when done.
   `npm test` runs the 11 checks.

## Part 2 — Publish to GitHub (built-in, no Git commands needed)

1. Click the **Source Control** icon on the left sidebar (the branch icon,
   or press **Ctrl+Shift+G**).
2. If the folder is not yet a Git repository, click **Initialize Repository**
   (or VS Code may show **Publish to GitHub…** directly — either works).
3. Type a commit message in the message box at the top, e.g.
   `Initial commit: bilingual loan calculator`, then click the blue
   **Commit** button (✓). If VS Code asks "would you like to add all files?",
   choose **Yes**.
4. Click the big **Publish to GitHub…** button.
5. A dropdown appears at the top of VS Code:
   - Choose **Publish to GitHub public repository** (public so recruiters can
     see it).
   - Keep the suggested name `mfi-loan-calculator`, press **Enter**.
6. A browser window may ask you to authorize VS Code again — accept it.
7. When finished, VS Code shows a notification **"Publishing to GitHub…"**
   followed by a link **Open on GitHub**. Click it — your code is now online.

The included `.gitignore` automatically excludes `node_modules` and `dist`,
so only source files are uploaded.

## Alternative Part 2 — terminal commands inside VS Code

If the Publish button is missing, use **Terminal → New Terminal** and run
(replace `YOUR-USERNAME`):

```bash
git init
git add .
git commit -m "Initial commit: bilingual loan calculator"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/mfi-loan-calculator.git
git push -u origin main
```

For this alternative, first create an **empty** repo on github.com:
**New repository** → name `mfi-loan-calculator` → do **not** tick README,
.gitignore or license → **Create repository**. A Windows sign-in popup will
handle your GitHub credentials on the first push.

## Part 3 — Verify

1. Refresh your repository page on github.com. You should see README.md,
   package.json, the `src` folder, LICENSE, etc. — and **no** `node_modules`.
2. Copy your repository URL, e.g.
   `https://github.com/YOUR-USERNAME/mfi-loan-calculator`.

## Part 4 — Deploy (Vercel, ~2 minutes)

1. Go to https://vercel.com → sign up **with GitHub**.
2. **Add New → Project** → import `mfi-loan-calculator`.
3. Keep the detected Vite settings (build `npm run build`, output `dist`).
4. Click **Deploy**, then copy the live URL it gives you.

Send both URLs (GitHub + Vercel) back to have the CV updated.

## Updating the project later

After changing code in VS Code: Source Control panel → type a message →
**Commit** → **Sync Changes** (the cloud icon). Vercel redeploys automatically.
