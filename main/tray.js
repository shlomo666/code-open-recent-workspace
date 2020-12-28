const { Tray, screen, Menu, app } = require('electron');
const path = require('path');
const { setShortcut, getShortcut } = require('./actions');

const appDir = path.dirname(require.main.filename);
const package = require(appDir + '/package.json');

/** @type {Electron.Tray} */
let tray;
exports.setTray = () => {
  if (!tray) {
    tray = new Tray(appDir + '/menu_bar_icon.png');
  }
  tray.setToolTip(package.productName);
  const shortcut = getShortcut();
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Shortcut',
        submenu: Menu.buildFromTemplate(['alt+space', 'ctrl+space'].map((key) => ({ label: key, click: () => setShortcut(key), type: 'radio', checked: key === shortcut }))),
      },
      {
        label: 'Quit',
        click: () => app.quit(),
      },
    ])
  );
};
