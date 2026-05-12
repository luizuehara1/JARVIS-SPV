const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('jarvisPC', {
  openApp: (appName) => ipcRenderer.invoke('open-app', appName),
  searchGoogle: (query) => ipcRenderer.invoke('search-google', query),
  searchYoutube: (query) => ipcRenderer.invoke('search-youtube', query),
  openUrl: (url) => ipcRenderer.invoke('open-url', url),
  openFolder: (folderName) => ipcRenderer.invoke('open-folder', folderName),
  createFile: (data) => ipcRenderer.invoke('create-file', data),
  readFile: (data) => ipcRenderer.invoke('read-file', data),
  moveFile: (data) => ipcRenderer.invoke('move-file', data),
  renameFile: (data) => ipcRenderer.invoke('rename-file', data),
  takeScreenshot: () => ipcRenderer.invoke('take-screenshot'),
  volumeUp: () => ipcRenderer.invoke('volume-up'),
  volumeDown: () => ipcRenderer.invoke('volume-down'),
  muteVolume: () => ipcRenderer.invoke('mute-volume'),
  isElectron: true
});
