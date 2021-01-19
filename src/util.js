const path = require('path');
const md5File = require('md5-file');

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

function getFileHashName(imageFileAbsolutePath, md5) {
  if (!md5) {
    return path.basename(imageFileAbsolutePath);
  }
  const imageExtName = path.extname(imageFileAbsolutePath);
  const imageBaseName = path.basename(imageFileAbsolutePath, imageExtName);
  const imageMd5 = md5File.sync(imageFileAbsolutePath);

  return imageBaseName + '.' + imageMd5.substr(0, md5) + imageExtName;
}

function handler(imageSrcValue, resourceFilePath, options) {
  const { publicPath, md5, hook } = options;

  const imageFilePath = path.resolve(
    path.dirname(resourceFilePath),
    imageSrcValue
  );
  const imageFileName = path.basename(imageFilePath);
  const imageHashName = getFileHashName(imageFilePath, md5);
  const imagePublicUrl = publicPath + imageHashName;

  typeof hook === 'function' &&
    hook(imageFileName, imageFilePath, imageHashName, imagePublicUrl);

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
