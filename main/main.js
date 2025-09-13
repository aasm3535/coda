const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
require('dotenv').config()

let mainWindow;
let splashWindow;

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 200,
    height: 200,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  splashWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  splashWindow.on('closed', () => (splashWindow = null));
}

function createMainWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    show: false, // Don't show until content is loaded
    frame: false,
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, '../renderer/preload.js') // Ensure preload script is loaded
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.webContents.on('did-finish-load', () => {
    if (splashWindow) {
      splashWindow.destroy();
    }
    mainWindow.show();
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createSplashWindow();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Listener to handle drag region
ipcMain.on('set-drag-region', (event, region) => {
  mainWindow.setVibrancy('dark'); // Example, not directly related to drag
});

ipcMain.on('load-main', () => {
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
});