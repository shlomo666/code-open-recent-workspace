const fs = require('fs');

const vscodeSettingsFilePath = `${process.env.HOME}/Library/Application Support/Code/storage.json`;

/** @returns {string[]} */
exports.getListOfWorkspacesByRecentOrder = () => {
  const settings = JSON.parse(fs.readFileSync(vscodeSettingsFilePath).toString());

  const { workspaces3, entries } = settings.openedPathsList;
  const order = (workspaces3 || entries.map((p) => p.folderUri).filter((p) => p)).map((p) => p.slice(7));
  return order;
};

exports.onSettingChanged = (cb) => {
  fs.watchFile('vscodeSettingsFilePath', () => {
    cb();
  });
};
