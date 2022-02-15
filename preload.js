const { exec } = require('child_process');
const { ipcRenderer } = require('electron');
const { getUnorderedList, replaceHTML, resetHTML, up, down, getCurrentResult } = require('./preload/elements');
const { getListOfWorkspacesByRecentOrder } = require('./preload/vscodeSettingsReader');

window.addEventListener('DOMContentLoaded', () => {
  const searchField = document.getElementById('searchField');
  searchField.focus();

  searchField.onkeyup = (event) => {
    const { key } = event;
    const currentResult = getCurrentResult();
    if (key === 'Enter' && currentResult) {
      exec(`code '${currentResult}'`);
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
    replaceHTML('results', getUnorderedList(results, text && regex));
  };
});

function getChoices(regex) {
  const listOfWorkspacesByRecentOrder = getListOfWorkspacesByRecentOrder();
  return [...new Set([...listOfWorkspacesByRecentOrder.filter((p) => regex.test(p.split('/').pop())), ...listOfWorkspacesByRecentOrder.filter((p) => regex.test(p))])].slice(0, 8);
}
