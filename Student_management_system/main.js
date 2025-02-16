
import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { fileURLToPath } from "url";
import  path  from 'path';
import {server} from "./server.js"
import  url  from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serverProcess;



let mainWindow;

app.on('ready' , function(){
    serverProcess = server;

    mainWindow = new BrowserWindow({
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
        webSecurity: false
      },
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname , './views/mainWindow.html'),
        protocol:'file:',
        slashes:true
    }));

    
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          app.quit();
        }
      });
});

ipcMain.on("show-alert", (event, message) => {
  if (mainWindow) {
      dialog.showMessageBox(mainWindow, {
          type: "info",
          title: "تنبيه",
          message: message,
          buttons: ["موافق"],
      });
  }
});









app.on('will-quit', () => {
    if (serverProcess && serverProcess.close) {
      serverProcess.close(() => {
        console.log('Server stopped gracefully.');
      });
    }
});

