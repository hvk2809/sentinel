# Sentinel SOC Dashboard: Free Vercel Deployment Guide

A step-by-step operational manual for deploying the Next.js 15 Sentinel Security Operations Center (SOC) dashboard on Vercel under the 100% free Hobby tier.

---

## 1. Overview and Hosting Specifications

Vercel provides native, optimized hosting for Next.js applications with zero hosting fees on their Hobby plan:
- **Cost:** $0.00 / month (100% Free)
- **SSL / TLS:** Automatic HTTPS certificate provisioning
- **Global Edge Network:** CDN distribution with low-latency worldwide routing
- **Continuous Deployment:** Automatic build and redeploy on every `git push`

---

## 2. Deployment Method 1: GitHub Integration (Recommended)

This method connects your GitHub repository to Vercel for automatic continuous deployment.

### Step 1: Push Your Code to GitHub
Ensure your local project is pushed to a remote GitHub repository:
```bash
git add .
git commit -m "feat: complete sentinel soc dashboard"
git push origin main
```

### Step 2: Access Vercel Console
1. Navigate to [https://vercel.com](https://vercel.com).
2. Sign in or create a free account using your GitHub credentials.

### Step 3: Import Project
1. On the Vercel Dashboard, click **Add New...** and select **Project**.
2. Under **Import Git Repository**, locate your repository and click **Import**.

### Step 4: Configure Project Settings (Critical Step)
Because the Next.js application resides within the `security-dashboard` subfolder, you must configure the root directory:

1. Under **Project Name**, enter a desired identifier (for example: `sentinel-soc-dashboard`).
2. Under **Framework Preset**, verify that **Next.js** is selected.
3. Next to **Root Directory**, click **Edit** and choose `security-dashboard`.
4. Leave **Build Command** (`next build`) and **Output Directory** (`.next`) as default.

### Step 5: Trigger Deployment
1. Click **Deploy**.
2. Vercel will clone the repository, install dependencies with `npm install`, compile the Next.js build, and assign an active production URL.
3. Within 60 seconds, your dashboard will be live at:
   ```
   https://<your-project-name>.vercel.app
   ```

---

## 3. Deployment Method 2: Vercel CLI (Command Line)

If you prefer to deploy directly from your local terminal without connecting GitHub:

### Step 1: Install Vercel CLI Globally
```bash
npm install -g vercel
```

### Step 2: Authenticate Terminal
```bash
vercel login
```
Follow the browser verification prompt to link your Vercel account.

### Step 3: Deploy from the Dashboard Directory
Navigate into the Next.js application directory and run the deployment wizard:
```bash
cd /home/nurphy/Desktop/M_Hash_2026/sentinel/security-dashboard
vercel
```

When prompted by the interactive wizard, configure as follows:
- `Set up and deploy "~/sentinel/security-dashboard"?`: **Y**
- `Which scope do you want to deploy to?`: Select your personal account
- `Link to existing project?`: **N**
- `What's your project's name?`: `sentinel-soc-dashboard`
- `In which directory is your code located?`: `./`
- `Want to modify these settings?`: **N**

### Step 4: Deploy to Production
To publish the build directly to your live production URL:
```bash
vercel --prod
```

---

## 4. Post-Deployment Verification Checklist

Once deployed, verify the following operational items:
1. **Full-Screen Layout:** Open the deployed URL and verify responsive rendering on desktop and mobile screens.
2. **Scenario Triage:** Select different incident presets (`USER_INSIDER_MALORY`, `USER_BENIGN_ALICE`, `USER_INSIDER_BOB`) in the dashboard to confirm reactive state updates.
3. **Module Routing:** Click through the navigation tabs (**Threats**, **Vulnerabilities**, **Network**, **Users**, **Reports**, **Settings**) to ensure static routes function properly.
4. **Operator Identity:** Confirm that the header and sidebar display **Vijay Eswaran S** with the role **Security Administrator | Microsoft**.

---

## 5. Troubleshooting Common Issues

### 1. 404 Not Found or Directory Errors
- **Cause:** Root Directory was not configured to `security-dashboard`.
- **Resolution:** In the Vercel project dashboard, navigate to **Settings** > **General** > **Root Directory**, enter `security-dashboard`, and trigger a redeployment.

### 2. Build Failure During Static Page Generation
- **Cause:** Stale cache or dependency version conflict.
- **Resolution:** In Vercel, navigate to the deployment log, click **Redeploy**, and select **Clear Build Cache & Redeploy**.

---

## 6. Summary

| Parameter | Configuration |
| :--- | :--- |
| **Hosting Platform** | Vercel (Hobby Tier) |
| **Framework** | Next.js 15 (App Router) |
| **Root Directory** | `security-dashboard` |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Monthly Cost** | $0.00 (Free) |
