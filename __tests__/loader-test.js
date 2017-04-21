const path = require('path');
const fs = require('fs');
const deleteFile = require('rimraf').sync;
const webpack = require('webpack');

const outputFile = path.join(__dirname, 'fixtures/done.js');

function getWebpackConfig(opts) {
  const config = {
    target: 'web',
    entry: path.join(__dirname, 'fixtures/main.js'),
    output: {
      path: path.join(__dirname, 'fixtures'),
      filename: 'done.js',
    },
    module: {
      rules: [
        {
          test: /\.jsx.md$/,
          loader: path.resolve(__dirname, '../index.js'),
          options: opts || {},
        },
      ],
    },
    externals: {
      react: 'React',
    },
  };

  return config;
}

describe('markdown-to-jsx-loader', function () {
  afterEach(function () {
    deleteFile(outputFile);
  });

  it('wraps the markdown in div tag by default', function (done) {
    const compiler = webpack(getWebpackConfig());

    compiler.run(function (err, stats) {
      if (err) return done(err);

      const output = fs.readFileSync(outputFile, { encoding: 'utf8' });

      expect(output).toMatchSnapshot();

      done();
    });
  });

  it('wraps the markdown in span tag', function (done) {
    const compiler = webpack(getWebpackConfig({ wrapperTag: 'span' }));

    compiler.run(function (err, stats) {
      if (err) return done(err);

      const output = fs.readFileSync(outputFile, { encoding: 'utf8' });

      expect(output).toMatchSnapshot();

      done();
    });
  });

  it('returns a react pure function', function (done) {
    const compiler = webpack(getWebpackConfig({ wrapWith: 'function' }));

    compiler.run(function (err, stats) {
      if (err) return done(err);

      const output = fs.readFileSync(outputFile, { encoding: 'utf8' });

      expect(output).toMatchSnapshot();

      done();
    });
  });

  it('returns a react component', function (done) {
    const compiler = webpack(getWebpackConfig({ wrapWith: 'class' }));

    compiler.run(function (err, stats) {
      if (err) return done(err);

      const output = fs.readFileSync(outputFile, { encoding: 'utf8' });

      expect(output).toMatchSnapshot();

      done();
    });
  });
});
