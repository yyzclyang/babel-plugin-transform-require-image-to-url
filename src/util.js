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

function isValidAsset(validator, fileName) {
  switch (Object.prototype.toString.call(validator)) {
    case '[object RegExp]': {
      return validator.test(fileName);
    }
    case '[object String]': {
      return new RegExp(validator).test(fileName);
    }
    case '[object Function]': {
      return validator(fileName);
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

const defaultImageValidator = /\.(png|jpeg|jpg|gif)$/;

module.exports = {
  isRequireStatement,
  isValidArgument,
  isValidAsset,
  getHashFileName,
  defaultImageValidator
};
