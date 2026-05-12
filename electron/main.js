const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');

// Whitelist configuration
const WHITELISTED_APPS = {
  'spotify': 'start spotify',
  'chrome': 'start chrome',
  'vscode': 'code'
};

const WHITELISTED_URLS = [
  'google.com',
  'youtube.com',
  'whatsapp.com',
  'facebook.com', // Meta Ads
  'openai.com', // ChatGPT
  'anthropic.com', // Claude
  'claude.ai',
  'google.com/aisearch', // Example for AI Studio
  'aistudio.google.com',
  'vercel.com',
  'github.com',
  'firebase.google.com'
];

function isUrlAllowed(url) {
  try {
    const parsed = new URL(url);
    return WHITELISTED_URLS.some(domain => parsed.hostname.includes(domain));
  } catch (e) {
    return false;
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    backgroundColor: '#00000000',
  });

  // Load the production Vercel URL as requested
  win.loadURL("https://jarvis-spv.vercel.app");
  
  // DevTools only for development if needed
  // win.webContents.openDevTools({ mode: 'detach' });
}

// IPC Handlers
ipcMain.handle('open-app', async (event, appName) => {
  const command = WHITELISTED_APPS[appName.toLowerCase()];
  if (!command) {
    return { success: false, error: 'App not authorized' };
  }

  return new Promise((resolve) => {
    exec(command, (error) => {
      if (error) {
        resolve({ success: false, error: error.message });
      } else {
        resolve({ success: true });
      }
    });
  });
});

ipcMain.handle('search-google', async (event, query) => {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  await shell.openExternal(url);
  return { success: true };
});

ipcMain.handle('search-youtube', async (event, query) => {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  await shell.openExternal(url);
  return { success: true };
});

ipcMain.handle('open-url', async (event, url) => {
  if (isUrlAllowed(url)) {
    await shell.openExternal(url);
    return { success: true };
  }
  return { success: false, error: 'URL not authorized' };
});

// App lifecycle
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
