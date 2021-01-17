const path = require('path');
const {
  isRequireStatement,
  isValidArgument,
  isNeedTransform,
  getHashFileName,
  defaultOptions
} = require('./util');

module.exports = function ({ types: t }) {
  return {
    visitor: {
      CallExpression(p, state) {
        if (isRequireStatement(p) && isValidArgument(p)) {
          const { opts } = state;
          const options = Object.assign({}, defaultOptions, opts);
          const { test, exclude, publicPath, md5, hook } = options;

          const imageSrcValue = p.get('arguments')[0].node.value;

          if (isNeedTransform(imageSrcValue, test, exclude)) {
            const filePath = path.resolve(
              path.dirname(state.file.opts.filename),
              imageSrcValue
            );
            const fileName = path.basename(filePath);
            const hashFileName = getHashFileName(
              path.relative(state.cwd, filePath),
              md5
            );

            const imagePublicUrl = publicPath + hashFileName;

            p.replaceWith(t.valueToNode(imagePublicUrl));
            typeof hook === 'function' &&
              hook(fileName, filePath, hashFileName, imagePublicUrl);
          }
        }
      }
    }
  };
};
