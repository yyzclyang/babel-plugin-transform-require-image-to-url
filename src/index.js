const { file } = require('@babel/types');
const path = require('path');
const { testAsset, copyFile, getMD5FileName } = require('./util');

module.exports = function ({ types: t }) {
  return {
    visitor: {
      CallExpression(_path, _ref = { opts: {} }) {
        if (_path.node.callee.name === 'require') {
          const filePath = path.resolve(
            path.dirname(_ref.filename),
            _path.node.arguments[0].value
          );
          const originFileName = path.basename(filePath);
          const md5FileName = getMD5FileName(filePath);
          if (testAsset(_ref.opts.test, originFileName)) {
            const newNode = t.stringLiteral(_ref.opts.publicPath + md5FileName);
            const _parentPath = _path.parentPath;
            if (t.isMemberExpression(_parentPath)) {
              const key = _parentPath.toComputedKey();
              if (key.value === 'default') {
                _parentPath.replaceWith(newNode);
              }
            } else {
              _path.replaceWith(newNode);
            }
            copyFile(
              filePath,
              path.resolve(_ref.cwd, _ref.opts.outDir, md5FileName)
            );
          }
        }
      }
    }
  };
};
