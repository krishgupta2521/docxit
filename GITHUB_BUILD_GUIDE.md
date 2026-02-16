# Building DOCXIT on GitHub Actions

## Overview

Yes! Building on GitHub will work perfectly and avoids local Rust toolchain issues. GitHub's Windows runners come pre-configured with the MSVC toolchain.

## How It Works

### ✅ Automatic Builds on Push

Every time you push to the `main` branch, GitHub Actions will:
1. Set up Node.js and Rust (MSVC toolchain)
2. Install dependencies
3. Build the Tauri app
4. Upload installers as artifacts

### ✅ Download Built Installers

After a successful build:
1. Go to your repository on GitHub
2. Click **Actions** tab
3. Click on the latest workflow run
4. Scroll to **Artifacts** section
5. Download:
   - `docxit-nsis-installer` (recommended for Windows)
   - `docxit-msi-installer` (alternative installer)

## Creating a Release

### Option 1: Tag-Based Release (Recommended)

Push a version tag to automatically create a GitHub release:

```bash
# Create and push a tag
git tag v0.1.0
git push origin v0.1.0
```

This triggers the **Release** workflow which:
- Builds the app
- Creates a GitHub Release
- Attaches installers automatically

### Option 2: Manual Workflow Trigger

1. Go to **Actions** tab on GitHub
2. Select **Build Tauri App** workflow
3. Click **Run workflow** dropdown
4. Click **Run workflow** button
5. Wait for completion
6. Download artifacts

## Workflow Files

### `.github/workflows/build.yml`
- **Trigger**: Every push to `main` or pull request
- **Purpose**: Build and test the app
- **Outputs**: Artifacts (installers) available for download

### `.github/workflows/release.yml`
- **Trigger**: When you push a version tag (e.g., `v0.1.0`)
- **Purpose**: Create a GitHub release with installers
- **Outputs**: Public release page with downloadable installers

## Setup Steps (One-Time)

### 1. Push Your Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - DOCXIT forensic documentation suite"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/Rawat-05/docxit.git

# Push to GitHub
git push -u origin main
```

### 2. Enable GitHub Actions

GitHub Actions should be enabled by default. If not:
1. Go to repository **Settings**
2. Click **Actions** → **General**
3. Under "Actions permissions", select **Allow all actions**
4. Click **Save**

### 3. Check First Build

1. Go to **Actions** tab
2. You should see a workflow running
3. Wait 5-10 minutes for first build
4. Download artifacts when complete

## Installing the Built App

### NSIS Installer (Recommended)
1. Download `docxit-nsis-installer.zip`
2. Extract the `.exe` file
3. Run the installer
4. Follow installation wizard

### MSI Installer
1. Download `docxit-msi-installer.zip`
2. Extract the `.msi` file
3. Double-click to install
4. Follow Windows installer prompts

## Advantages of GitHub Builds

✅ **No Local Setup Required**
- No need to install Rust locally
- No need to configure MSVC toolchain
- GitHub runners have everything pre-configured

✅ **Consistent Builds**
- Same environment every time
- No "works on my machine" issues
- Reproducible builds

✅ **Distribution Ready**
- Installers available immediately
- Easy to share with team/clients
- Automatic versioning via tags

✅ **Free for Public Repos**
- Unlimited build minutes for public repositories
- No cost for open-source projects

## Troubleshooting

### Build Fails on GitHub

**Check the logs:**
1. Click on the failed workflow run
2. Click on the **build** job
3. Expand failed step to see error

**Common issues:**
- Missing dependencies in `package.json` → Add them and push
- Rust compilation error → Check `Cargo.toml` and `lib.rs`
- Python scripts not found → Ensure `tools/` folder is committed

### Can't Download Artifacts

- Artifacts expire after 90 days by default
- Only available for completed builds
- Require GitHub account to download

### Want Both Electron and Tauri Builds

Add this to your workflow to support both:

```yaml
- name: Build Electron App
  run: npm run electron:build
  
- name: Upload Electron Portable
  uses: actions/upload-artifact@v4
  with:
    name: docxit-electron-portable
    path: dist/*.exe
```

## Version Control Tips

### What to Commit
✅ Commit:
- `src-tauri/` (Rust source)
- `web/` (Frontend)
- `tools/` (Python scripts)
- `.github/workflows/` (CI/CD config)
- `package.json`, `Cargo.toml`
- Documentation files

❌ Don't commit:
- `node_modules/`
- `src-tauri/target/`
- `dist/`
- Build outputs

### Create `.gitignore` if missing:

```bash
# Add to .gitignore
echo "node_modules/" >> .gitignore
echo "src-tauri/target/" >> .gitignore
echo "dist/" >> .gitignore
echo ".env" >> .gitignore
```

## Creating Your First Release

```bash
# Make sure everything is committed
git add .
git commit -m "Ready for v0.1.0 release"
git push origin main

# Create and push version tag
git tag -a v0.1.0 -m "First stable release - DOCXIT v0.1.0"
git push origin v0.1.0

# GitHub will automatically:
# - Build the app
# - Create release page
# - Attach installers
# - Generate release notes
```

Then share the release link with users:
`https://github.com/Rawat-05/docxit/releases/tag/v0.1.0`

## Summary

**Yes, building on GitHub will work!** It's actually the recommended approach because:

1. ✅ Avoids local Rust toolchain issues
2. ✅ Uses correct MSVC toolchain automatically
3. ✅ Provides consistent, reproducible builds
4. ✅ Easy distribution via GitHub Releases
5. ✅ Free for public repositories

Just push your code and let GitHub do the building! 🚀

---

**Next Steps:**
1. Commit all your changes
2. Push to GitHub
3. Check the Actions tab
4. Download the built installer
5. Test the app
6. Create a release tag when ready
