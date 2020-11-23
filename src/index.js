const path = require('path');
const {
  testAsset,
  copyFile,
  getFileNewName,
  defaultImageValidator,
  defaultOutDir
} = require('./util');

module.exports = function ({ types: t }) {
  return {
    visitor: {
      CallExpression(_path, _ref = { opts: {} }) {
        if (_path.node.callee.name === 'require') {
          const {
            filename,
            opts: {
              test: imageValidator = defaultImageValidator,
              publicPath = '',
              outDir = defaultOutDir,
              md5 = 4
            }
          } = _ref;

          const filePath = path.resolve(
            path.dirname(filename),
            _path.node.arguments[0].value
          );
          const originFileName = path.basename(filePath);
          const fileNewName = getFileNewName(filePath, md5);

          if (testAsset(imageValidator, originFileName)) {
            const newNode = t.valueToNode(publicPath + fileNewName);
            const _parentPath = _path.parentPath;
            if (t.isMemberExpression(_parentPath)) {
              const key = _parentPath.toComputedKey();
              if (key.value === 'default') {
                _parentPath.replaceWith(newNode);
              }
            } else {
              _path.replaceWith(newNode);
            }
            if (outDir) {
              copyFile(filePath, path.resolve(_ref.cwd, outDir, fileNewName));
            }
          }
        }
      }
    }
  };
};
