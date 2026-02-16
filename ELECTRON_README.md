# DOCXIT - Forensic Documentation Suite (Electron Edition)

**DOCXIT** is a comprehensive forensic documentation tool that generates professional documents for digital forensic investigations. This is the **Electron desktop application** version.

## Features

- **Single Form Entry**: Enter case details once
- **Multi-Document Generation**: Automatically generate 5+ forensic documents
- **Multiple Export Formats**: PDF, DOCX, HTML, Print-ready
- **DOCX Extraction**: Extract data from existing DOCX templates
- **Custom Templates**: Create custom documentation templates
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Documents Generated

1. **63A Certificate** - Digital evidence seizure certificate
2. **Chain of Custody** - Evidence chain documentation
3. **Evidence Collection** - Detailed evidence collection form
4. **Job Form** - Investigation job form
5. **Working/Master Sticker** - Device identification stickers

## System Requirements

- **Node.js** 16+ and npm
- **Python** 3.6+ (for document generation tools)
- **Windows**, **macOS**, or **Linux**

### Python Dependencies

Install required Python packages:

```bash
cd tools
pip install -r requirements.txt
```

## Installation

Clone and install dependencies:

```bash
git clone https://github.com/Rawat-05/docxit.git
cd docxit
npm install
```

## Development

Start the app in development mode:

```bash
npm run dev
```

or

```bash
npm start
```

## Building

### For Windows

```bash
npm run build:win
```

This creates:
- NSIS installer (`docxit-0.1.0.exe`)
- Portable executable (`docxit-0.1.0.exe`)

### For macOS

```bash
npm run build:mac
```

### For Linux

```bash
npm run build:linux
```

### Build All Platforms

```bash
npm run build:all
```

## Project Structure

```
docxit/
├── electron-main.js          # Electron main process
├── preload.js                # Preload script for IPC security
├── package.json              # Dependencies and scripts
├── web/                       # Web UI (React-free vanilla JS)
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── assets/
├── tools/                     # Python backend
│   ├── docx_generate.py       # Generate DOCX files
│   ├── docx_extract.py        # Extract data from DOCX
│   └── requirements.txt
└── src-tauri/                # Legacy Tauri configuration (deprecated)
```

## Features Breakdown

### Desktop Capabilities

- **File Dialog**: Open/save files using native OS dialogs
- **Python Integration**: Execute Python scripts from UI via IPC
- **Document Export**: Generate and save documents to disk

### Supported Export Formats

| Format | Single | Bundle |
|--------|--------|--------|
| PDF    | ✓      | ✓      |
| DOCX   | ✓      | ✓      |
| HTML   | ✓      | ✗      |
| Print  | ✓      | ✓      |
| JSON   | ✓      | ✗      |

## Usage

1. **Open the App**: Run `npm start` or launch the installed executable
2. **Fill Case Details**: Enter all relevant case and device information
3. **Select Document Type**: Choose from 5 document templates
4. **Export**: Choose export format (PDF, DOCX, HTML, Print, JSON)
5. **Save**: Select location and save the generated documents

## IPC Channels

The Electron app exposes the following IPC channels to the renderer process:

### File Dialogs

```javascript
// Open file dialog
window.electron.openFile(options)

// Save file dialog
window.electron.saveFile(options)
```

### Python Operations

```javascript
// Generate DOCX document
window.electron.generateDocx(data)

// Extract data from DOCX
window.electron.extractDocx(filePath)
```

## Security

- **Context Isolation**: Enabled
- **Sandbox**: Enabled
- **Preload Script**: All IPC exposed through preload.js
- **No Remote Module**: Disabled for security
- **CSP**: Configured to prevent XSS

## Known Limitations

- Python tools must be installed and accessible in PATH
- File operations work only within the desktop app (web version has restrictions)
- Maximum document size limited by system memory

## Troubleshooting

### App won't start

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Python script errors

```bash
# Verify Python installation
python --version

# Install Python dependencies
pip install python-docx
```

### Build errors on Windows

```bash
# Install build tools
npm install --global windows-build-tools

# Then rebuild
npm run build:win
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

See LICENSE file for details.

## Author

**Shivam Rawat**

Developed for EnReach Solutions

## Support

For issues and feature requests, please use the GitHub issues page.

---

**Note**: This is the Electron version of DOCXIT. A Tauri version is also available in the `src-tauri/` directory.
