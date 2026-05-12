const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const { exec } = require('child_process');
const screenshot = require('screenshot-desktop');

// Safe Path Configuration
const DOCUMENTS_PATH = app.getPath('documents');
const SAFE_ROOT = path.join(DOCUMENTS_PATH, 'Jarvis-SPV');
const SAFE_FOLDERS = {
  notes: path.join(SAFE_ROOT, 'notes'),
  screenshots: path.join(SAFE_ROOT, 'screenshots'),
  exports: path.join(SAFE_ROOT, 'exports'),
  projects: path.join(SAFE_ROOT, 'projects')
};

// Ensure folders exist
async function ensureSafeFolders() {
  await fs.ensureDir(SAFE_ROOT);
  for (const folder of Object.values(SAFE_FOLDERS)) {
    await fs.ensureDir(folder);
  }
}

// Whitelist configuration
const WHITELISTED_APPS = {
  'spotify': 'start spotify',
  'chrome': 'start chrome',
  'vscode': 'code',
  'calc': 'calc',
  'explorer': 'explorer .'
};

const WHITELISTED_URLS = [
  'google.com',
  'youtube.com',
  'whatsapp.com',
  'facebook.com',
  'openai.com',
  'anthropic.com',
  'claude.ai',
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
    width: 1280,
    height: 850,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    backgroundColor: '#00000000',
  });

  win.loadURL("https://jarvis-spv.vercel.app");
}

// IPC Handlers
ipcMain.handle('open-app', async (event, appName) => {
  const command = WHITELISTED_APPS[appName.toLowerCase()];
  if (!command) return { success: false, error: 'App not authorized' };

  return new Promise((resolve) => {
    exec(command, (error) => {
      if (error) resolve({ success: false, error: error.message });
      else resolve({ success: true });
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

// Advanced Handlers
ipcMain.handle('open-folder', async (event, folderName) => {
  const p = SAFE_FOLDERS[folderName] || SAFE_ROOT;
  await shell.openPath(p);
  return { success: true };
});

ipcMain.handle('create-file', async (event, { name, content, subfolder = 'notes' }) => {
  try {
    const targetFolder = SAFE_FOLDERS[subfolder] || SAFE_FOLDERS.notes;
    const filePath = path.join(targetFolder, name);
    await fs.writeFile(filePath, content || '');
    return { success: true, path: filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('read-file', async (event, { name, subfolder = 'notes' }) => {
  try {
    const filePath = path.join(SAFE_FOLDERS[subfolder] || SAFE_FOLDERS.notes, name);
    const content = await fs.readFile(filePath, 'utf8');
    return { success: true, content };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('move-file', async (event, { oldPath, newPath }) => {
  try {
    // Basic safety: only allow moving if it starts with SAFE_ROOT
    if (!oldPath.startsWith(SAFE_ROOT) || !newPath.startsWith(SAFE_ROOT)) {
      return { success: false, error: 'Path outside safe zone' };
    }
    await fs.move(oldPath, newPath);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('rename-file', async (event, { filePath, newName }) => {
  try {
    if (!filePath.startsWith(SAFE_ROOT)) {
      return { success: false, error: 'Path outside safe zone' };
    }
    const dir = path.dirname(filePath);
    const newPath = path.join(dir, newName);
    await fs.rename(filePath, newPath);
    return { success: true, path: newPath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('take-screenshot', async (event) => {
  try {
    const filename = `screenshot_${Date.now()}.png`;
    const filePath = path.join(SAFE_FOLDERS.screenshots, filename);
    await screenshot({ filename: filePath });
    return { success: true, path: filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Volume Control (Windows specific)
ipcMain.handle('volume-up', async () => {
  exec('powershell -Command "(new-object -com wscript.shell).SendKeys([char]175)"');
  return { success: true };
});

ipcMain.handle('volume-down', async () => {
  exec('powershell -Command "(new-object -com wscript.shell).SendKeys([char]174)"');
  return { success: true };
});

ipcMain.handle('mute-volume', async () => {
  exec('powershell -Command "(new-object -com wscript.shell).SendKeys([char]173)"');
  return { success: true };
});

// App lifecycle
app.whenReady().then(async () => {
  await ensureSafeFolders();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

