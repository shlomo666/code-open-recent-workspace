const fs = require('fs');

const vscodeSettingsFilePath = `${process.env.HOME}/Library/Application Support/Code/storage.json`;

const getListOfWorkspacesByRecentOrder = () => {
  const settings = JSON.parse(fs.readFileSync(vscodeSettingsFilePath).toString());

  const { workspaces3, entries } = settings.openedPathsList;
  /** @type {string[]} */
  const order = (workspaces3 || entries.map((p) => p.folderUri).filter((p) => p)).map((p) => decodeURI(p.slice(7)));
  const existingOrder = order.filter((path) => fs.existsSync(path));

  return existingOrder;
};

let ttl = 0;
let cachedOrder = null;

/** @returns {string[]} */
exports.getListOfWorkspacesByRecentOrder = () => {
  if (ttl > Date.now() && cachedOrder) {
    return cachedOrder;
  } else {
    ttl = Date.now() + 1000 * 60 * 15;
    cachedOrder = getListOfWorkspacesByRecentOrder();
    return cachedOrder;
  }
};

// Listen to changes in vscode settings
fs.watchFile(vscodeSettingsFilePath, () => {
  cachedOrder = null;
  exports.getListOfWorkspacesByRecentOrder(); // Don't read in real time
});
