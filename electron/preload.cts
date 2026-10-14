// The bridge between the page and the desktop. The page sees these few functions and nothing of Node or Electron.
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('parchemin', {
  platform: process.platform,
  pickSave: (name: string, filter: { name: string; extensions: string[] }) => ipcRenderer.invoke('pick-save', name, filter),
  writeFile: (path: string, data: Uint8Array) => ipcRenderer.invoke('write-file', path, data),
  setTheme: (theme: string) => ipcRenderer.send('theme', theme),
  setTitleBar: (colors: { color: string; symbolColor: string }) => ipcRenderer.send('title-bar', colors),
})
