const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false, // Keep it cinematic
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    backgroundColor: '#00000000',
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );
  
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

// IPC Handlers for System Commands
ipcMain.handle('execute-command', async (event, command) => {
  console.log(`[JARVIS-CORE] Received System Command: ${command}`);
  
  let shellCommand = '';
  const lowerCommand = command.toLowerCase();

  if (lowerCommand.includes('spotify')) {
    shellCommand = 'start spotify';
  } else if (lowerCommand.includes('chrome') || lowerCommand.includes('navegador')) {
    shellCommand = 'start chrome';
  } else if (lowerCommand.includes('vscode') || lowerCommand.includes('code')) {
    shellCommand = 'code';
  } else if (lowerCommand.includes('calculadora')) {
    shellCommand = 'calc';
  } else if (lowerCommand.includes('explorer') || lowerCommand.includes('arquivos')) {
    shellCommand = 'explorer .';
  } else {
    // Attempt to run the raw command if it looks like a known app
    shellCommand = `start ${command}`;
  }

  return new Promise((resolve) => {
    if (!shellCommand) return resolve({ success: false, error: 'Command not recognized' });
    
    exec(shellCommand, (error) => {
      if (error) {
        console.error(`[JARVIS-CORE] Operation Failed: ${error.message}`);
        resolve({ success: false, error: error.message });
      } else {
        console.log(`[JARVIS-CORE] Protocol Success: ${shellCommand}`);
        resolve({ success: true });
      }
    });
  });
});

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
