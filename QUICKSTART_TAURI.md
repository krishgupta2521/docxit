# 🚀 Quick Start Guide - Tauri Version

## First Time Setup (One-time only)

### Step 1: Install Prerequisites
```powershell
# Check if Rust is installed
rustc --version

# If not installed, download and install from: https://rustup.rs/
# After installation, restart your terminal and run:
rustup default stable
```

### Step 2: Install Dependencies
```powershell
# Navigate to project directory
cd C:\Users\Krish\Documents\Development\docs_suite

# Install Node packages
npm install

# Install Python requirements (if not already done)
pip install -r tools/requirements.txt
```

## Running the App

### Option 1: Tauri (Recommended - Smaller, Faster)
```powershell
npm run dev
```
**or**
```powershell
npm run tauri:dev
```

### Option 2: Electron (Traditional)
```powershell
npm run electron:dev
```

## Building for Production

### Build Tauri Installer
```powershell
npm run tauri:build
```
**Output**: `src-tauri\target\release\bundle\nsis\DOCXIT_0.1.0_x64-setup.exe`

### Build Electron Portable
```powershell
npm run electron:build
```
**Output**: `dist\DOCXIT-0.1.0-portable.exe`

## Quick Comparison

| Feature | Tauri | Electron |
|---------|-------|----------|
| Bundle Size | ~5 MB | ~150 MB |
| Memory Usage | Low | Medium-High |
| Startup Time | Fast | Moderate |
| Backend | Rust | Node.js |
| System Integration | Native | Node APIs |

## Troubleshooting

### "rustc not found"
**Solution**: Install Rust from https://rustup.rs/ and restart terminal

### "Python not found"
**Solution**: Install Python from https://python.org/ and add to PATH

### "WebView2 missing"
**Solution**: Install from https://developer.microsoft.com/microsoft-edge/webview2/

### App doesn't start in Tauri
**Solution**: Run with debug output:
```powershell
$env:RUST_BACKTRACE=1
npm run dev
```

## What Changed for Tauri?

✅ **Backend**: Now uses Rust instead of Node.js for better performance  
✅ **Window**: Native OS window (smaller, faster)  
✅ **APIs**: Platform-agnostic code in `web/app.js` works with both Electron and Tauri  
✅ **Bundle**: Significantly smaller executable  

All features remain identical - you can switch between Electron and Tauri anytime!

## Next Steps

1. **Start Development**: `npm run dev`
2. **Make Changes**: Edit files in `web/` folder
3. **Test**: Changes auto-reload in development mode
4. **Build**: `npm run tauri:build` when ready to distribute

---

**Questions?** Check [TAURI_README.md](TAURI_README.md) for detailed documentation.
