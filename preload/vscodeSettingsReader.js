const fs = require('fs');
const { cachedFn } = require('./utils');

const FIFTEEN_MINUTES = 1000 * 60 * 15;
const vscodeWorkspaceStoragePath = `${process.env.HOME}/Library/Application Support/Code/User/workspaceStorage`;
const folderPathPrefix = 'file://';

const getListOfWorkspacesByRecentOrder = () => {
  console.log('getListOfWorkspacesByRecentOrder...');
  const workspaceIds = fs
    .readdirSync(vscodeWorkspaceStoragePath, { withFileTypes: true })
    .filter((f) => f.isDirectory())
    .map((f) => f.name)
    .filter((id) => fs.existsSync(`${vscodeWorkspaceStoragePath}/${id}/workspace.json`));

  /** @type {string[]} */
  const folderUris = workspaceIds.map((id) => require(`${vscodeWorkspaceStoragePath}/${id}/workspace.json`).folder);
  const paths = folderUris.filter((f) => f && f.startsWith(folderPathPrefix)).map((p) => decodeURI(p.slice(folderPathPrefix.length)));
  const existingPaths = paths.filter((path) => fs.existsSync(path));
  console.log({ existingPaths });
  return existingPaths;
};

/** @returns {string[]} */
exports.getListOfWorkspacesByRecentOrder = cachedFn(getListOfWorkspacesByRecentOrder, FIFTEEN_MINUTES);

// Listen to changes in vscode settings
fs.watch(vscodeWorkspaceStoragePath, () => {
  exports.getListOfWorkspacesByRecentOrder.invalidate();
  exports.getListOfWorkspacesByRecentOrder(); // Don't read in real time - preload it
});
