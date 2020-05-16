const { app, globalShortcut, screen } = require('electron');
const { getCursorScreenPoint, getDisplayNearestPoint } = screen;

const shortcut = 'alt+space';

/** @param {Electron.BrowserWindow} win */
exports.hide = (win) => {
  win.hide();
  app.dock.hide();
  globalShortcut.register(shortcut, () => {
    exports.show(win);
  });
};

/** @param {Electron.BrowserWindow} win */
exports.show = (win) => {
  globalShortcut.unregister(shortcut);

  app.dock.hide();
  win.showInactive();

  const currentScreen = getDisplayNearestPoint(getCursorScreenPoint());
  const { x, y } = currentScreen.workArea;
  win.setBounds({ x, y });
  win.center();

  setTimeout(() => {
    win.focus();
    app.dock.show();
  }, 100);
};
