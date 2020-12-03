const path = require('path');
const {
  isRequireStatement,
  isValidArgument,
  isValidAsset,
  getHashFileName,
  defaultImageValidator
} = require('./util');

module.exports = function ({ types: t }) {
  return {
    visitor: {
      CallExpression(p, state) {
        if (isRequireStatement(p) && isValidArgument(p)) {
          const {
            opts: {
              test: imageValidator = defaultImageValidator,
              publicPath = '',
              md5 = 4,
              hook
            }
          } = state;

          const filePath = path.resolve(
            path.dirname(state.file.opts.filename),
            p.get('arguments')[0].node.value
          );
          const fileName = path.basename(filePath);
          const hashFileName = getHashFileName(
            path.relative(state.cwd, filePath),
            md5
          );

          if (isValidAsset(imageValidator, fileName)) {
            const pp = p.parentPath;
            const imagePublicUrl = publicPath + hashFileName;

            if (t.isMemberExpression(pp)) {
              if (pp.toComputedKey().value === 'default') {
                pp.replaceWith(t.valueToNode(imagePublicUrl));
              }
            } else {
              p.replaceWith(t.valueToNode(imagePublicUrl));
            }
            typeof hook === 'function' &&
              hook(fileName, filePath, hashFileName, imagePublicUrl);
          }
        }
      }
    }
  };
};
