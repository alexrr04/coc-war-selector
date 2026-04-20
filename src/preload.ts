import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  fetchClanData: (clanTag: string): Promise<ClanData> =>
    ipcRenderer.invoke('fetchClanData', clanTag),

  fetchMemberData: (memberTag: string): Promise<MemberData> =>
    ipcRenderer.invoke('fetchMemberData', memberTag),
});
