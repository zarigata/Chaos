const { app, BrowserWindow, Tray, Menu, nativeImage, Notification } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// CODEX: set up auto-updater logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

let serverProc;
let win;
let tray;

function createWindow() {
  win = new BrowserWindow({
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

// CODEX: system tray
function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'tray-icon.png');
  const trayIcon = nativeImage.createFromPath(iconPath);
  tray = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => win.show() },
    { label: 'Hide', click: () => win.hide() },
    { type: 'separator' },
    { label: 'Quit', click: () => { if (serverProc) serverProc.kill(); app.quit(); } }
  ]);
  tray.setToolTip('C.H.A.O.S');
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  // Launch backend server
  const backendPath = path.resolve(__dirname, '../backend/dist/index.js');
  serverProc = spawn('node', [backendPath], {
    cwd: path.resolve(__dirname, '../backend'),
    stdio: 'inherit',
  });

  createWindow();
  createTray();
  autoUpdater.checkForUpdatesAndNotify();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Auto-updater events
autoUpdater.on('update-available', () => {
  new Notification({ title: 'Update available', body: 'Downloading update...' }).show();
});
autoUpdater.on('update-downloaded', () => {
  new Notification({ title: 'Update downloaded', body: 'Restart to install update.' }).show();
});

app.on('window-all-closed', () => {
  if (serverProc) serverProc.kill();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
