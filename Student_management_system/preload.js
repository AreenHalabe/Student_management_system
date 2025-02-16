const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
    showAlert: (message) => ipcRenderer.send("show-alert", message),
    showConfirm: (message) => ipcRenderer.invoke("show-confirm", message),

});



