import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('storeAPI', {
  get: (key) => ipcRenderer.invoke('store-get', key),
  set: (key, value) => ipcRenderer.invoke('store-set', key, value),
  clear: () => ipcRenderer.invoke('store-clear')
});