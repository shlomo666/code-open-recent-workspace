let choiceIdx = 0;
/** @type {string[]} */
let choices = [];

exports.resetHTML = () => {
  const searchField = document.getElementById('searchField');

  searchField.value = '';
  this.replaceHTML('results', '');
  choiceIdx = 0;
};

/** @param {string[]} results
 * @param {RegExp} regex */
exports.getUnorderedList = (results, regex) => {
  if (JSON.stringify(choices) !== JSON.stringify(results)) {
    choices = results;
    choiceIdx = 0;
  }

  return `<ul>${results
    .map(
      (result, i) =>
        `<li style="margin: 0 0 3px 0">${liValue(
          result,
          regex,
          i === choiceIdx
        )}</li>`
    )
    .join('\n')}</ul>`;
};

/** @param {string} result
 * @param {RegExp} regex
 * @param {boolean} first */
function liValue(result, regex, first) {
  let name = result.split('/').pop();
  let path = result.split('/').slice(0, -1).join('/');
  if (path.startsWith(process.env.HOME)) {
    path = path.substring(process.env.HOME.length + 1);
  }

  name = name.replace(regex, (match) => span(match, 'color: red'));
  path = path.replace(regex, (match) => span(match, 'color: red'));

  let val = `${span(name, 'font-size: 30px')}` + (path ? ` (${path})` : '');

  if (first) {
    val = span(val, 'color: magenta');
  } else {
    val = span(val, 'color: white');
  }
  console.log({ path, name, result, val });
  return val;
}

function span(text, style) {
  return `<span style="${style}">${text}</span>`;
}

exports.replaceHTML = (selector, text) => {
  const element = document.getElementById(selector);
  if (element) element.innerHTML = text;
};

exports.down = () => {
  choiceIdx = (choiceIdx + 1) % choices.length;
};
exports.up = () => {
  choiceIdx = (choices.length + choiceIdx - 1) % choices.length;
};

exports.getCurrentResult = () => choices[choiceIdx];
