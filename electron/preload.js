const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  executeCommand: (command) => ipcRenderer.invoke('execute-command', command),
  isElectron: true
});
