import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let client: ReturnType<typeof import('clash-of-clans-api')> | null = null;

try {
  const clashApi = require('clash-of-clans-api');
  const env = require('./env') as { COC_API_TOKEN: string };
  client = clashApi({ token: env.COC_API_TOKEN });
} catch (e) {
  console.error('Failed to initialise CoC API client:', e);
}

ipcMain.handle('fetchClanData', (_event, clanTag: string) => {
  if (!client) throw new Error('API client not initialised');
  return client.clanByTag(clanTag);
});

ipcMain.handle('fetchMemberData', (_event, memberTag: string) => {
  if (!client) throw new Error('API client not initialised');
  return client.playerByTag(memberTag);
});

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, '../assets/icons/icon_transparent'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../src/index.html'));
}

app.whenReady().then(() => {
  createWindow();
  console.log('App ready!');
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
