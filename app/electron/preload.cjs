// Preload script: exposes a minimal, read-only API to the renderer.
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('orthodeck', {
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  },
  isDesktop: true,
});
