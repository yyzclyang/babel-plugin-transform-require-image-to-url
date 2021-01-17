const path = require('path');
const crypto = require('crypto');

function isRequireStatement(p) {
  const callee = p.get('callee');
  return callee.isIdentifier() && callee.equals('name', 'require');
}

function isValidArgument(p) {
  const arg = p.get('arguments')[0];
  return arg && arg.isStringLiteral();
}

function isNeedTransform(imageSrcValue, test, exclude) {
  return (
    assetValidator(imageSrcValue, test) &&
    !assetValidator(imageSrcValue, exclude)
  );
}

function assetValidator(imageSrcValue, validator) {
  switch (Object.prototype.toString.call(validator)) {
    case '[object RegExp]': {
      return validator.test(imageSrcValue);
    }
    case '[object String]': {
      return new RegExp(validator).test(imageSrcValue);
    }
    case '[object Function]': {
      return validator(imageSrcValue);
    }
    default: {
      return false;
    }
  }
}

function getHashFileName(relativeFilePath, md5) {
  if (!md5) {
    return path.basename(relativeFilePath);
  }
  const extName = path.extname(relativeFilePath);
  const baseName = path.basename(relativeFilePath, extName);
  const fsHash = crypto.createHash('md5');
  fsHash.update(relativeFilePath);
  const md5Value = fsHash.digest('hex');
  return baseName + '.' + md5Value.substr(0, md5) + extName;
}

const defaultOptions = {
  test: /\.(png|jpeg|jpg|gif)$/,
  exclude: /\.local\.(png|jpeg|jpg|gif)$/,
  publicPath: '',
  outPath: 'dist/cdn-assets',
  md5: 4
};

module.exports = {
  isRequireStatement,
  isValidArgument,
  isNeedTransform,
  getHashFileName,
  defaultOptions
};
