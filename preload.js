const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // File dialog operations
  openFile: (options) => ipcRenderer.invoke('dialog:openFile', options),
  saveFile: (options) => ipcRenderer.invoke('dialog:saveFile', options),
  
  // Python operations
  generateDocx: (data) => ipcRenderer.invoke('python:generateDocx', data),
  extractDocx: (filePath) => ipcRenderer.invoke('python:extractDocx', filePath)
});
