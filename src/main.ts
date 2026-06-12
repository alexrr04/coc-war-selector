import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

type CocEnv = {
  COC_API_TOKEN?: string;
};

const { COC_API_TOKEN } = require('./env') as CocEnv;
const COC_BASE_URL = 'https://api.clashofclans.com/v1';

function encodeClashTag(tag: string): string {
  const trimmedTag = tag.trim();
  return encodeURIComponent(trimmedTag.startsWith('#') ? trimmedTag : `#${trimmedTag}`);
}

async function fetchCoc<T>(endpoint: string, notFoundMessage = 'Resource not found'): Promise<T> {
  if (!COC_API_TOKEN) {
    throw new Error('API client not initialised');
  }

  const authHeader = 'Bearer '.concat(COC_API_TOKEN);
  const response = await fetch(`${COC_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: authHeader,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(notFoundMessage);
    }
    throw new Error(`Clash of Clans API request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

ipcMain.handle('fetchClanData', (_event, clanTag: string) => {
  return fetchCoc<ClanData>(`/clans/${encodeClashTag(clanTag)}`, 'Clan not found');
});

ipcMain.handle('fetchMemberData', (_event, memberTag: string) => {
  return fetchCoc<MemberData>(`/players/${encodeClashTag(memberTag)}`, 'Player not found');
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
