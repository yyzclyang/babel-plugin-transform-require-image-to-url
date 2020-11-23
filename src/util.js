const path = require('path');
const crypto = require('crypto');

function testAsset(rule, fileName) {
  switch (Object.prototype.toString.call(rule)) {
    case '[object RegExp]': {
      return rule.test(fileName);
    }
    case '[object String]': {
      return new RegExp(rule).test(fileName);
    }
    default: {
      return false;
    }
  }
}

function getFileNewName(relativeFilePath, md5) {
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
  testAsset,
  getFileNewName,
  defaultImageValidator
};
