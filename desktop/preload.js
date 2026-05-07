const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // From Renderer to Main
  toggleOn: () => ipcRenderer.send('TOGGLE_ON'),
  toggleOff: () => ipcRenderer.send('TOGGLE_OFF'),
  applyBlur: (message) => ipcRenderer.send('APPLY_BLUR', message),
  removeBlur: () => ipcRenderer.send('REMOVE_BLUR'),
  playRestSound: () => ipcRenderer.send('PLAY_REST_SOUND'),
  sendAiStatus: (status) => ipcRenderer.send('AI_STATUS', status),
  sendDebugStats: (stats) => ipcRenderer.send('DEBUG_STATS', stats),
  minimizeApp: () => ipcRenderer.send('MINIMIZE_APP'),
  closeApp: () => ipcRenderer.send('CLOSE_APP'),
  openExternal: (url) => ipcRenderer.send('OPEN_EXTERNAL', url),

  // Auth Methods
  signUp: (data) => ipcRenderer.invoke('AUTH_SIGN_UP', data),
  signIn: (data) => ipcRenderer.invoke('AUTH_SIGN_IN', data),
  signOut: () => ipcRenderer.invoke('AUTH_SIGN_OUT'),
  getUser: () => ipcRenderer.invoke('AUTH_GET_USER'),

  // From Main to Renderer
  onStartCamera: (callback) => ipcRenderer.on('START_CAMERA', () => callback()),
  onStopCamera: (callback) => ipcRenderer.on('STOP_CAMERA', () => callback()),
  onApplyBlur: (callback) => ipcRenderer.on('APPLY_BLUR', (event, message) => callback(message)),
  onRemoveBlur: (callback) => ipcRenderer.on('REMOVE_BLUR', () => callback()),
  onAiStatus: (callback) => ipcRenderer.on('AI_STATUS', (event, status) => callback(status)),
  onDebugStats: (callback) => ipcRenderer.on('DEBUG_STATS', (event, stats) => callback(stats)),
  onPlayRestSound: (callback) => ipcRenderer.on('PLAY_REST_SOUND', () => callback())
});
