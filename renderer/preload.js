const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  setDragRegion: (region) => ipcRenderer.send('set-drag-region', region),
  supabaseConfig: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});