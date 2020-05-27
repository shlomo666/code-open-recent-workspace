const { execSync } = require('child_process');
const { ipcRenderer } = require('electron');
const {
  getUnorderedList,
  replaceHTML,
  resetHTML,
  up,
  down,
  getCurrentResult
} = require('./preload/elements');
const {
  getListOfWorkspacesByRecentOrder,
  onSettingChanged
} = require('./preload/vscodeSettingsReader');

const vscodeAppPath = execSync(
  `mdfind "kMDItemKind == 'Application'" | grep "Visual Studio Code.app"`
)
  .toString()
  .trim();

window.addEventListener('DOMContentLoaded', () => {
  const searchField = document.getElementById('searchField');
  searchField.focus();

  searchField.onkeyup = (event) => {
    const { key } = event;
    const currentResult = getCurrentResult();
    if (key === 'Enter' && currentResult) {
      execSync(`open -n "${vscodeAppPath}" --args ${currentResult}`);
      resetHTML();
      ipcRenderer.send('hide');
    }
    if (key === 'Escape') {
      ipcRenderer.send('hide');
      resetHTML();
    }
  };

  searchField.onkeydown = (event) => {
    const { key } = event;
    if (key === 'ArrowDown') {
      console.log('down');
      down();
    } else if (key === 'ArrowUp') {
      console.log('up');
      up();
    } else if (key === 'Escape') {
      return;
    }
    setTimeout(() => {
      search(searchField.value);
    });
  };

  const search = (text) => {
    const regex = new RegExp(text, 'i');
    const results = getChoices(regex);
    replaceHTML('results', getUnorderedList(results, regex));
  };
});

let listOfWorkspacesByRecentOrder = getListOfWorkspacesByRecentOrder();
onSettingChanged(() => {
  listOfWorkspacesByRecentOrder = getListOfWorkspacesByRecentOrder();
});

function getChoices(regex) {
  return [
    ...new Set([
      ...listOfWorkspacesByRecentOrder.filter((p) =>
        regex.test(p.split('/').pop())
      ),
      ...listOfWorkspacesByRecentOrder.filter((p) => regex.test(p))
    ])
  ].slice(0, 8);
}
