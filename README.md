# UZH Graphic Studio

A modern, brand-compliant campaign graphics builder for the **University of Zurich (UZH)**. It enables administrators and communication officers to generate marketing assets—including print flyers, social media posts, and digital signage displays—simultaneously and in real-time, enforcing UZH's branding rules.

This application is built with **React**, **TypeScript**, and **Vite**.

---

## 🌟 Key Features

1. **Simultaneous Multi-Format Canvas Workspace**
   - View and edit all formats side-by-side. 
   - Supports Print layouts (A0, A3/A4, A5), Social Media (Square, Portrait, Story), and Digital Screens (Polynex/Widescreen).
   - Toggles let you activate or deactivate specific formats dynamically.

2. **Unified Campaign Control Panel**
   - Live synchronization: edits to the title, description, or department details instantly propagate across all active formats.
   - Click-on-canvas context editing: click direct elements on any canvas to open their corresponding controls in the sidebar.

3. **Strict Brand Compliance**
   - Brand color swatches restrict options to approved UZH color palettes.
   - Dynamic logo variants (UZH Red, Black, and White/Transparent) auto-adjust depending on background contrast.
   - Brand-compliant typography setups.

4. **Dynamic QR Code Integration**
   - Auto-generates QR codes matching the target URL in real-time for print and display layouts.

5. **Integrated Image Support**
   - Upload custom local images or search for high-quality images via the Unsplash API integration.
   - Automatically appends required image credit and attribution metadata.

6. **AI-Assisted Copy Refinement**
   - Optional Anthropic AI integrations to optimize headlines or box text for specific target audiences.
   - **Privacy First**: API keys are entered client-side and saved temporarily in `sessionStorage` only—never committed or stored on a backend.

7. **One-Click Export**
   - Pre-compiles all active canvases and bundles them into a single, high-resolution `.zip` archive containing individual image assets.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Bundler**: Vite
- **Styling**: CSS Modules (Vanilla CSS)
- **Key Libraries**:
  - `html-to-image` for browser-based rendering
  - `jszip` for folder archiving
  - `qrcode` for QR code generation

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Installation

Clone or download the project, navigate into the directory, and install dependencies:

```bash
cd uzh-graphic-studio
npm install
```

### 2. Configure Environment Variables

Rename `.env.example` to `.env` in the root of the project:

```bash
cp .env.example .env
```

Open `.env` and configure your API keys (optional but recommended for full features):

```env
# Unsplash API key for image search
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

### 3. Local Development

Run the development server locally:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production

Build the production-ready optimized assets:

```bash
npm run build
```

This compiles your application into the `dist/` directory.

---

## 📤 Preparing & Uploading to GitHub

To store, share, and deploy your code, upload it to a GitHub repository:

### 1. Initialize Git in the Project Folder

In your terminal (inside the `uzh-graphic-studio` directory), run:

```bash
# Initialize local Git repository
git init

# Add all project files to Git tracking
git add .

# Create the initial commit
git commit -m "Initial commit: UZH Graphic Studio"
```

### 2. Create a Repository on GitHub
1. Log in to [GitHub](https://github.com).
2. Click **New** (or the **+** icon in the top right -> **New repository**).
3. Set the repository name (e.g., `uzh-graphic-studio`).
4. Keep it **Public** or **Private** as desired. Do **not** check "Add a README file" or "Add .gitignore" (as these are already in your project).
5. Click **Create repository**.

### 3. Link Local Git to GitHub and Push
Copy the commands shown on GitHub under "…or push an existing repository from the command line" and run them:

```bash
# Rename default branch to main
git branch -M main

# Add the remote GitHub repository link (replace with your actual GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/uzh-graphic-studio.git

# Push your code to GitHub
git push -u origin main
```

---

## ⚡ Deployment with Vercel

Vercel is the recommended hosting platform for Vite + React applications. It integrates directly with GitHub for automatic deployments.

### 1. Deploy via Vercel Dashboard (Recommended)

1. Sign up or log in at [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Select **Import** next to your `uzh-graphic-studio` repository.
4. In the **Configure Project** window:
   - **Framework Preset**: Vercel will automatically detect **Vite**.
   - **Root Directory**: If your GitHub repository contains the `uzh-graphic-studio` folder at the root level, select it or leave it as `./` (Vercel automatically detects the `package.json`).
   - **Build and Output Settings**:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`
5. **Environment Variables** (Optional):
   - Under the "Environment Variables" section, add:
     - Name: `VITE_UNSPLASH_ACCESS_KEY`
     - Value: *[Your Unsplash Access Key]*
6. Click **Deploy**.
7. Vercel will build and host your site, giving you a production URL (e.g., `uzh-graphic-studio.vercel.app`).

### 2. Continuous Integration
Every time you push changes to your `main` branch on GitHub (`git push`), Vercel will automatically build and deploy the updated version of your app!
