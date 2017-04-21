const babel = require('babel-core');
const marked = require('marked');
const reactPreset = require('babel-preset-react');
const loaderUtils = require('loader-utils');

function wrapWithClass(name, component) {
  return `class ${name} extends React.Component {
  render() {
    return ${component}
  }
}`;
}

function wrapWithFunction(name, component) {
  return `function ${name}() {
  return ${component}
}`;
}

module.exports = function (content) {
  if (this.cacheable) this.cacheable();

  const filename = this.resourcePath.split('/').pop().split('.').shift() || '';

  const loaderOptions = loaderUtils.getOptions(this) || {};
  const defaultOptions = {
    wrapperTag: 'div',
    wrapWith: null,
  };

  const options = Object.assign({}, defaultOptions, loaderOptions);
  const wrapperTag = options.wrapperTag;
  const wrapWith = options.wrapWith;

  let html = `<${wrapperTag}>`;
  html += marked(content);
  html += `</${wrapperTag}>`;

  let result = babel.transform(html, { presets: [reactPreset] }).code;

  switch (wrapWith) {
    case 'class':
      result = wrapWithClass(filename, result);
      break;
    case 'function':
      result = wrapWithFunction(filename, result);
      break;
    default:
      break;
  }

  const code = `const React = require('react');\n\nmodule.exports = ${result}`;

  this.callback(null, code);
};
