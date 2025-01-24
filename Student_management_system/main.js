
import  electron  from 'electron';
import { fileURLToPath } from "url";
import  path  from 'path';
import {server} from "./server.js"
import  url  from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serverProcess;

const { app , BrowserWindow } = electron;

let mainWindow;

app.on('ready' , function(){
    serverProcess = server;

    mainWindow = new BrowserWindow({});

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname , './views/mainWindow.html'),
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
          },
        protocol:'file:',
        slashes:true
    }));

    
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          app.quit();
        }
      });
});

app.on('will-quit', () => {
    if (serverProcess && serverProcess.close) {
      serverProcess.close(() => {
        console.log('Server stopped gracefully.');
      });
    }
  });
