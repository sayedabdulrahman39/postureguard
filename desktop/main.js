const { app, BrowserWindow, ipcMain, Tray, Menu, screen, nativeImage, shell } = require('electron');
const path = require('path');
const { supabase } = require('./src/lib/supabase');

let tray = null;
let controlWindow = null;
let overlayWindow = null;
let aiWindow = null;

let isRunning = false;

// --- IPC Communication for Supabase ---

ipcMain.handle('AUTH_SIGN_UP', async (event, { email, password, fullName }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  });
  return { data, error };
});

ipcMain.handle('AUTH_SIGN_IN', async (event, { email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
});

ipcMain.handle('AUTH_SIGN_OUT', async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
});

ipcMain.handle('AUTH_GET_USER', async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
});

ipcMain.on('OPEN_EXTERNAL', (event, url) => {
  shell.openExternal(url);
});

// --- Window Management ---

function createWindows() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // 1. Full-screen transparent overlay window (ignoring mouse events)
  overlayWindow = new BrowserWindow({
    width: screen.getPrimaryDisplay().bounds.width,
    height: screen.getPrimaryDisplay().bounds.height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  overlayWindow.setIgnoreMouseEvents(true);
  overlayWindow.loadFile(path.join(__dirname, 'src', 'overlay', 'overlay.html'));

  // 2. Hidden AI Processing Window
  aiWindow = new BrowserWindow({
    width: 640,
    height: 480,
    show: false, // Keep hidden!
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  aiWindow.loadFile(path.join(__dirname, 'src', 'ai', 'ai.html'));

  // 3. Control Window (Popup)
  controlWindow = new BrowserWindow({
    width: 350,
    height: 500,
    show: false,
    frame: false,
    resizable: false,
    skipTaskbar: false, // Show in Taskbar!
    alwaysOnTop: false, // Don't force always on top so it behaves like a normal window
    icon: path.join(__dirname, 'assets', 'icon.png'), // Add window icon here
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  controlWindow.loadFile(path.join(__dirname, 'src', 'popup', 'popup.html'));

  // Let the window be minimized instead of hiding when it loses focus, 
  // since it's now a proper taskbar application.
}

function createTray() {
  // Use nativeImage to safely create an icon even if the file is missing/corrupted
  let iconPath = path.join(__dirname, 'assets', 'icon.png');
  let icon = nativeImage.createFromPath(iconPath);
  
  // If the icon didn't load, create a 16x16 red square programmatically
  if (icon.isEmpty()) {
    console.log("Icon empty, using fallback color box.");
    // Base64 for a 16x16 red PNG
    const fallbackBase64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAA1SURBVDhPY/z//z8DkYDxgEFiwGgAigYwIigawIigAGgAowEoGsCIoGgAI4KiAWBgYGAAAAMA7681w/Ue3l4AAAAASUVORK5CYII=';
    icon = nativeImage.createFromDataURL(`data:image/png;base64,${fallbackBase64}`);
  }
  
  try {
    tray = new Tray(icon);
  } catch (e) {
    console.error("Tray creation failed:", e);
  }
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Control Panel', click: toggleControlWindow },
    { type: 'separator' },
    { label: 'Quit', click: () => { app.isQuiting = true; app.quit(); } }
  ]);

  if (tray) {
    tray.setToolTip('PostureGuard AI');
    tray.setContextMenu(contextMenu);
    tray.on('click', toggleControlWindow);
  }
}

function toggleControlWindow() {
  if (controlWindow.isVisible()) {
    if (controlWindow.isMinimized()) {
      controlWindow.restore();
      controlWindow.focus();
    } else {
      controlWindow.minimize();
    }
  } else {
    controlWindow.show();
    controlWindow.focus();
  }
}

app.whenReady().then(() => {
  createWindows();
  createTray(); 
  
  // Show the control window immediately on startup
  controlWindow.show();
  controlWindow.focus();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// --- IPC Communication ---

ipcMain.on('TOGGLE_ON', () => {
  isRunning = true;
  aiWindow.webContents.send('START_CAMERA');
});

ipcMain.on('TOGGLE_OFF', () => {
  isRunning = false;
  aiWindow.webContents.send('STOP_CAMERA');
  overlayWindow.webContents.send('REMOVE_BLUR');
});

ipcMain.on('APPLY_BLUR', (event, message) => {
  if (isRunning) overlayWindow.webContents.send('APPLY_BLUR', message);
});

ipcMain.on('PLAY_REST_SOUND', () => {
  aiWindow.webContents.send('PLAY_REST_SOUND');
});

ipcMain.on('REMOVE_BLUR', () => {
  overlayWindow.webContents.send('REMOVE_BLUR');
});

ipcMain.on('AI_STATUS', (event, status) => {
  controlWindow.webContents.send('AI_STATUS', status);
});

ipcMain.on('DEBUG_STATS', (event, stats) => {
  controlWindow.webContents.send('DEBUG_STATS', stats);
});

ipcMain.on('MINIMIZE_APP', () => {
  if (controlWindow) controlWindow.minimize();
});

ipcMain.on('CLOSE_APP', () => {
  app.quit();
});
