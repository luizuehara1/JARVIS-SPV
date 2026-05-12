const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('jarvisPC', {
  openApp: (appName) => ipcRenderer.invoke('open-app', appName),
  searchGoogle: (query) => ipcRenderer.invoke('search-google', query),
  searchYoutube: (query) => ipcRenderer.invoke('search-youtube', query),
  openUrl: (url) => ipcRenderer.invoke('open-url', url),
  isElectron: true
});
