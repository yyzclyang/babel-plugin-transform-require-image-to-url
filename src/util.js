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

function isNeedTransform(imageSrcValue, options) {
  const { test, exclude } = options;

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

function getHashFileName(imageFileRelativePath, md5) {
  if (!md5) {
    return path.basename(imageFileRelativePath);
  }
  const extName = path.extname(imageFileRelativePath);
  const baseName = path.basename(imageFileRelativePath, extName);
  const fsHash = crypto.createHash('md5');
  fsHash.update(imageFileRelativePath);
  const md5Value = fsHash.digest('hex');
  return baseName + '.' + md5Value.substr(0, md5) + extName;
}

function handler(
  imageSrcValue,
  resourceFilePath,
  currentWorkingDirectory,
  options
) {
  const { publicPath, md5, hook } = options;

  const imageFilePath = path.resolve(
    path.dirname(resourceFilePath),
    imageSrcValue
  );
  const imageFileName = path.basename(imageFilePath);

  const hashFileName = getHashFileName(
    path.relative(currentWorkingDirectory, imageFilePath),
    md5
  );

  const imagePublicUrl = publicPath + hashFileName;

  typeof hook === 'function' &&
    hook(imageFileName, imageFilePath, hashFileName, imagePublicUrl);

  return imagePublicUrl;
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
  handler,
  defaultOptions
};
