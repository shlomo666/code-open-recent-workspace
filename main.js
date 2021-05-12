// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const shellPath = require('shell-path');
const { execSync } = require('child_process');
const actions = require('./main/actions');
const tray = require('./main/tray');
const { sizeConstants } = require('./common/vars');

process.env.PATH = shellPath.sync();
try {
  execSync('which code');
} catch (err) {
  dialog.showErrorBox("Couldn't find code command.", 'Please go to vscode; type cmd+shift+p; type "install code" and click the first option.');
  app.exit(1);
  return process.exit(1);
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: sizeConstants.width,
    height: sizeConstants.height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    center: true,
    transparent: true,
    frame: false,
    show: false,
    fullScreenable: false
  });

  app.dock.hide();
  mainWindow.setAlwaysOnTop(true, 'floating');
  mainWindow.setVisibleOnAllWorkspaces(true);
  tray.setTray();

  setTimeout(() => {
    actions.show(mainWindow);
  }, 1000);

  ipcMain.on('hide', () => actions.hide(mainWindow));

  mainWindow.loadFile('index.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
