const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let serverProc;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  // Load the backend server (which also serves frontend static files)
  win.loadURL('http://localhost:3000');
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  // Launch backend server
  const backendPath = path.resolve(__dirname, '../backend/dist/index.js');
  serverProc = spawn('node', [backendPath], {
    cwd: path.resolve(__dirname, '../backend'),
    stdio: 'inherit',
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (serverProc) serverProc.kill();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
