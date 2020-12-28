const { globalShortcut, screen } = require('electron');
const path = require('path');
const { readFile, writeFileSync, readFileSync } = require('fs');

const { getCursorScreenPoint, getDisplayNearestPoint } = screen;
const appDir = path.dirname(require.main.filename);

const shortcutFilePath = `${appDir}/main/store/shortcut.txt`;

let shortcut = 'alt+space';
readFile(shortcutFilePath, (err, buf) => exports.setShortcut(buf.toString()));
exports.getShortcut = () => {
  return readFileSync(shortcutFilePath).toString();
};
exports.setShortcut = (newShortcut) => {
  if (registeredCallback) {
    globalShortcut.unregister(shortcut);
    globalShortcut.register(newShortcut, registeredCallback);
  }
  writeFileSync(shortcutFilePath, newShortcut);
  shortcut = newShortcut;
};

let registeredCallback;

/** @param {Electron.BrowserWindow} win */
exports.hide = (win) => {
  win.hide();

  registeredCallback = () => {
    exports.show(win);
  };
  globalShortcut.register(shortcut, registeredCallback);
};

/** @param {Electron.BrowserWindow} win */
exports.show = (win) => {
  globalShortcut.unregister(shortcut);
  registeredCallback = null;

  const currentScreen = getDisplayNearestPoint(getCursorScreenPoint());
  const { x, y } = currentScreen.workArea;
  win.setBounds({ x, y });
  win.center();
  win.focus();
  win.show();
};
