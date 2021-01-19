const path = require('path');
const fs = require('fs');
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

function getFileHashName(imageFileAbsolutePath, md5Length) {
  if (!md5Length) {
    return path.basename(imageFileAbsolutePath);
  }
  const imageExtName = path.extname(imageFileAbsolutePath);
  const imageBaseName = path.basename(imageFileAbsolutePath, imageExtName);
  const imageMd5 = md5File.sync(imageFileAbsolutePath);

  return imageBaseName + '.' + imageMd5.substr(0, md5Length) + imageExtName;
}

function copyFileSync(from, to) {
  if (fs.existsSync(to)) {
    return;
  }
  const toDir = path.dirname(to);
  fs.mkdirSync(toDir, { recursive: true });
  fs.copyFileSync(from, to);
}

function handler(imageSrcValue, resourceFilePath, options) {
  const { publicPath, md5Length, hook, outputPath, emitFile } = options;

  const imageFilePath = path.resolve(
    path.dirname(resourceFilePath),
    imageSrcValue
  );
  const imageFileName = path.basename(imageFilePath);
  const imageHashName = getFileHashName(imageFilePath, md5Length);
  const imagePublicUrl = publicPath + imageHashName;

  if (emitFile) {
    const imageOutputPath = path.join(process.cwd(), outputPath, imageHashName);
    copyFileSync(imageFilePath, imageOutputPath);
  }

  typeof hook === 'function' &&
    hook(imageFileName, imageFilePath, imageHashName, imagePublicUrl);

  return imagePublicUrl;
}

const defaultOptions = {
  test: /\.(png|jpeg|jpg|gif)$/,
  exclude: /\.local\.(png|jpeg|jpg|gif)$/,
  publicPath: '',
  outputPath: 'dist/cdn-assets',
  md5Length: 4,
  emitFile: true
};

module.exports = {
  isRequireStatement,
  isValidArgument,
  isNeedTransform,
  handler,
  defaultOptions
};
