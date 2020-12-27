const { globalShortcut, screen } = require('electron');
const { getCursorScreenPoint, getDisplayNearestPoint } = screen;

const shortcut = 'alt+space';

/** @param {Electron.BrowserWindow} win */
exports.hide = (win) => {
  win.hide();
  globalShortcut.register(shortcut, () => {
    exports.show(win);
  });
};

/** @param {Electron.BrowserWindow} win */
exports.show = (win) => {
  globalShortcut.unregister(shortcut);

  const currentScreen = getDisplayNearestPoint(getCursorScreenPoint());
  const { x, y } = currentScreen.workArea;
  win.setBounds({ x, y });
  win.center();
  win.focus();
  win.show();
};
