const fs = require('fs');
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

function getFileNewName(filePath, md5) {
  if (!md5) {
    return path.basename(filePath);
  }
  const extName = path.extname(filePath);
  const baseName = path.basename(filePath, extName);
  const fileBuffer = fs.readFileSync(filePath);
  const fsHash = crypto.createHash('md5');
  fsHash.update(fileBuffer);
  const md5Value = fsHash.digest('hex');
  return baseName + '.' + md5Value.substr(0, md5) + extName;
}

const defaultImageValidator = /\.(png|jpeg|jpg|gif|ico)$/;

module.exports = {
  testAsset,
  getFileNewName,
  defaultImageValidator
};
