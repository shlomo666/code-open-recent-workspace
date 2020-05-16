const { Tray, screen, Menu } = require('electron');
const path = require('path');

const appDir = path.dirname(require.main.filename);
const package = require(appDir + '/package.json');

/** @type {Electron.Tray} */
let tray;
exports.setTray = () => {
  if (!tray) {
    tray = new Tray(appDir + '/menu_bar_icon.png');
  }
  tray.setToolTip(package.productName);
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Quit',
        click: () => app.quit()
      }
    ])
  );
};
