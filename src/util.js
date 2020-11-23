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

function copyFile(from, to) {
  if (fs.existsSync(to)) {
    return;
  }
  const toDir = path.dirname(to);
  fs.mkdirSync(toDir, { recursive: true });
  fs.copyFileSync(from, to);
}

function getMD5FileName(filePath) {
  const extName = path.extname(filePath);
  const baseName = path.basename(filePath, extName);
  const fileBuffer = fs.readFileSync(filePath);
  const fsHash = crypto.createHash('md5');
  fsHash.update(fileBuffer);
  const md5 = fsHash.digest('hex');
  return baseName + '.' + md5 + extName;
}

const defaultImageValidator = /\.(png|jpeg|jpg|gif|ico)$/;

const defaultOutDir = 'dist';

module.exports = {
  testAsset,
  copyFile,
  getMD5FileName,
  defaultImageValidator,
  defaultOutDir
};
