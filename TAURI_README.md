# DOCXIT - Tauri Version Setup Guide

## Overview
DOCXIT is now available as both an Electron app and a Tauri app. This guide covers the Tauri version, which offers better performance, smaller bundle sizes, and native system integration using Rust.

## Prerequisites

### Required Software
1. **Rust** (latest stable version)
   - Windows: Download from https://rustup.rs/
   - Run: `rustup default stable`
   - Verify: `rustc --version`

2. **Node.js** (v18 or higher)
   - Download from https://nodejs.org/
   - Verify: `node --version`

3. **Python** (v3.8 or higher) - for DOCX processing
   - Windows: Download from https://python.org/
   - Ensure Python is in PATH
   - Install requirements: `pip install -r tools/requirements.txt`

### Windows-Specific Requirements
- **WebView2**: Usually pre-installed on Windows 10/11
- **Visual Studio Build Tools** (if not already installed):
  ```powershell
  winget install Microsoft.VisualStudio.2022.BuildTools
  ```

## Installation

1. **Clone/Navigate to the project directory**
   ```bash
   cd C:\Users\Krish\Documents\Development\docs_suite
   ```

2. **Install Node dependencies**
   ```bash
   npm install
   ```

3. **Install Tauri CLI (if not already installed)**
   ```bash
   npm install --save-dev @tauri-apps/cli
   ```

4. **Install Python dependencies for DOCX processing**
   ```bash
   pip install -r tools/requirements.txt
   ```

## Running the Tauri App

### Development Mode
```bash
npm run tauri:dev
```
or simply:
```bash
npm run dev
```

This will:
- Compile the Rust backend
- Start the Tauri development server
- Open the application window
- Enable hot-reload for frontend changes

### Building for Production

#### Build for Windows
```bash
npm run tauri:build
```
or:
```bash
npm run build:win
```

The built application will be in:
```
src-tauri/target/release/
```

#### Installer/Executable Location
After building, you'll find:
- **Portable EXE**: `src-tauri/target/release/bundle/nsis/DOCXIT_0.1.0_x64-setup.exe`
- **MSI Installer**: `src-tauri/target/release/bundle/msi/DOCXIT_0.1.0_x64_en-US.msi`

## Project Structure

```
docs_suite/
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── main.rs         # Entry point
│   │   └── lib.rs          # Application logic & Tauri commands
│   ├── Cargo.toml          # Rust dependencies
│   ├── tauri.conf.json     # Tauri configuration
│   └── build.rs            # Build script
├── web/                    # Frontend files (served by Tauri)
│   ├── index.html          # Main HTML
│   ├── app.js              # Application logic (Electron + Tauri compatible)
│   ├── styles.css          # Styling
│   ├── tauri-loader.js     # Tauri API loader
│   └── assets/             # Images, icons
├── tools/                  # Python scripts for DOCX generation
│   ├── docx_extract.py     # Extract text from DOCX
│   └── docx_generate.py    # Generate DOCX from templates
├── electron-main.js        # Electron entry (for Electron version)
├── preload.js              # Electron preload (for Electron version)
└── package.json            # Node dependencies & scripts
```

## Key Differences: Tauri vs Electron

### Tauri Advantages
- **Smaller Bundle**: ~3-5 MB vs 150+ MB for Electron
- **Better Performance**: Native Rust backend
- **Lower Memory Usage**: Uses system webview
- **Better Security**: Sandboxed by default
- **Native Features**: Direct OS integration

### Running Both Versions

#### Electron Version
```bash
npm run electron:dev
```

#### Tauri Version
```bash
npm run tauri:dev
```

## Features Available in Tauri

All features from the Electron version are supported:
- ✅ 63A Certificate generation
- ✅ Chain of Custody documents
- ✅ Evidence Collection forms
- ✅ Job Forms
- ✅ Working/Master Stickers
- ✅ Custom Document templates
- ✅ DOCX extraction and generation
- ✅ PDF export (via print)
- ✅ HTML export
- ✅ Multi-device management
- ✅ Hash value validation
- ✅ Duplicate detection

## Tauri Commands (Backend API)

The Rust backend exposes these commands to the frontend:

### `extract_docx`
Extracts text from a DOCX file using Python script.
```javascript
const { invoke } = window.__TAURI__.core;
const text = await invoke('extract_docx', { path: '/path/to/file.docx' });
```

### `generate_docx`
Generates a DOCX file from JSON payload using Python script.
```javascript
const { invoke } = window.__TAURI__.core;
const result = await invoke('generate_docx', { 
  payloadJson: JSON.stringify(data),
  outputPath: '/path/to/output.docx'
});
```

## Configuration

### Window Settings
Edit `src-tauri/tauri.conf.json`:
```json
{
  "app": {
    "windows": [{
      "title": "DOCXIT - Forensic Documentation Suite",
      "width": 1400,
      "height": 900,
      "minWidth": 1024,
      "minHeight": 768
    }]
  }
}
```

### Security Settings
Tauri uses CSP (Content Security Policy) by default. Adjust in `tauri.conf.json`:
```json
{
  "app": {
    "security": {
      "csp": null  // Disabled for flexibility; enable in production
    }
  }
}
```

## Troubleshooting

### Tauri Build Fails
**Issue**: `cargo build` errors
**Solution**: 
```bash
rustup update stable
cargo clean
npm run tauri:build
```

### Python Script Not Found
**Issue**: `Failed to resolve extractor path`
**Solution**: Ensure Python scripts are in `tools/` directory and Python is in PATH

### WebView2 Missing
**Issue**: Application doesn't start on Windows
**Solution**: Install WebView2 Runtime from https://developer.microsoft.com/en-us/microsoft-edge/webview2/

### API Not Loading
**Issue**: Tauri APIs not available in browser console
**Solution**: 
- Check browser console for errors
- Verify `tauri-loader.js` is loaded in network tab
- Ensure you're running in Tauri (not browser), check for `window.__TAURI_INTERNALS__`

### File Dialogs Not Opening
**Issue**: DOCX file selection doesn't work
**Solution**:
- Verify `tauri-plugin-dialog` is in `Cargo.toml`
- Check permissions in `tauri.conf.json`
- Rebuild: `cargo clean && npm run tauri:build`

## Development Tips

### Hot Reload
Frontend changes (HTML/CSS/JS) reload automatically in dev mode. Rust changes require restart.

### Debug Console
- **Frontend**: F12 or Ctrl+Shift+I
- **Backend**: Check terminal output where `tauri dev` is running

### Testing Python Scripts
Test DOCX processing independently:
```bash
python tools/docx_extract.py path/to/file.docx
python tools/docx_generate.py payload.json output.docx
```

## Building for Distribution

### Create Installer
```bash
npm run tauri:build
```

### Customize Installer
Edit `src-tauri/tauri.conf.json`:
```json
{
  "bundle": {
    "windows": {
      "wix": {
        "language": "en-US"
      }
    }
  }
}
```

## Support

For Tauri-specific issues:
- Tauri Documentation: https://tauri.app/v2/
- Tauri Discord: https://discord.com/invite/tauri

For DOCXIT issues:
- Developer: Shivam Rawat
- Organization: EnReach Solution

## Version Information

- **DOCXIT Version**: 0.1.0
- **Tauri Version**: 2.x
- **Supported Platforms**: Windows (primary), macOS, Linux

---

**Note**: The Tauri version shares the same frontend code (`web/` folder) with the Electron version, so either can be used based on your deployment preferences. Tauri is recommended for production due to smaller size and better performance.
