const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
    showAlert: (message) => ipcRenderer.send("show-alert", message),
});



console.log('preload file is readed');