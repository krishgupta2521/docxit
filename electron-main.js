const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true
    },
    icon: path.join(__dirname, 'assets/docxit-logo.png')
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'web/index.html')}`;
  mainWindow.loadURL(startUrl);

  // Open DevTools in development
  if (process.env.ELECTRON_DEV_MODE) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About DOCXIT',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About DOCXIT',
              message: 'DOCXIT - Forensic Documentation Suite',
              detail: 'Version 0.1.0\nDeveloped by Shivam Rawat\nPowered by Electron'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // On Windows/Linux, quit when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle file dialogs
ipcMain.handle('dialog:openFile', async (event, options) => {
  return await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    ...options
  });
});

ipcMain.handle('dialog:saveFile', async (event, options) => {
  return await dialog.showSaveDialog(mainWindow, options);
});

// Handle Python script execution for document generation
ipcMain.handle('python:generateDocx', async (event, data) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, 'tools', 'docx_generate.py');
    const dataFile = path.join(__dirname, 'temp_data.json');
    
    // Write data to temp file
    fs.writeFileSync(dataFile, JSON.stringify(data));

    const python = spawn('python', [pythonScript, dataFile]);
    let output = '';
    let error = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('close', (code) => {
      fs.unlinkSync(dataFile); // Clean up temp file
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (e) {
          resolve({ success: false, message: 'Failed to parse output' });
        }
      } else {
        reject(new Error(error || `Python script failed with code ${code}`));
      }
    });
  });
});

// Handle Python script execution for document extraction
ipcMain.handle('python:extractDocx', async (event, filePath) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, 'tools', 'docx_extract.py');
    const python = spawn('python', [pythonScript, filePath]);
    let output = '';
    let error = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (e) {
          resolve({ success: false, message: 'Failed to parse output' });
        }
      } else {
        reject(new Error(error || `Python script failed with code ${code}`));
      }
    });
  });
});
