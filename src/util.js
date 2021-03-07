const path = require('path');
const fs = require('fs');
const md5File = require('md5-file');

/**
 * 判断是否为 require 语句
 * @param p ast 节点
 * @returns {boolean}
 */
function isRequireStatement(p) {
  const callee = p.get('callee');
  return callee.isIdentifier() && callee.equals('name', 'require');
}

/**
 * 判断参数是否合法
 * @param p ast 节点
 * @returns {boolean}
 */
function isValidArgument(p) {
  const arg = p.get('arguments')[0];
  return arg && arg.isStringLiteral();
}

/**
 * 判断资源是否需要转换
 * @param imageSrcValue require 引用的值
 * @param options 选项
 * @returns {boolean}
 */
function isNeedTransform(imageSrcValue, options) {
  const { test, exclude } = options;

  return (
    assetValidator(imageSrcValue, test) &&
    !assetValidator(imageSrcValue, exclude)
  );
}

/**
 * 资源验证器
 * @param imageSrcValue require 引用的值
 * @param validator 验证器
 * @returns {boolean}
 */
function assetValidator(imageSrcValue, validator) {
  switch (Object.prototype.toString.call(validator)) {
    // 正则验证器
    case '[object RegExp]': {
      return validator.test(imageSrcValue);
    }
    // 字符串验证器，会被转换成正则验证器
    case '[object String]': {
      return new RegExp(validator).test(imageSrcValue);
    }
    // 函数验证器
    case '[object Function]': {
      return validator(imageSrcValue);
    }
    default: {
      return false;
    }
  }
}

/**
 * 获取图片资源带 md5 哈希值的名称
 * @param imageFileAbsolutePath 图片资源的绝对路径
 * @param md5Length md5 哈希值的长度
 * @returns {string}
 */
function getFileHashName(imageFileAbsolutePath, md5Length) {
  if (md5Length < 1) {
    return path.basename(imageFileAbsolutePath);
  }
  const imageExtName = path.extname(imageFileAbsolutePath);
  const imageBaseName = path.basename(imageFileAbsolutePath, imageExtName);
  const imageMd5 = md5File.sync(imageFileAbsolutePath);

  return (
    imageBaseName +
    '.' +
    imageMd5.substr(0, Math.floor(md5Length)) +
    imageExtName
  );
}

/**
 * 复制文件
 * @param from 来源处
 * @param to 目标处
 */
function copyFileSync(from, to) {
  // 如果资源已存在，不重复复制
  if (fs.existsSync(to)) {
    return;
  }
  const toDir = path.dirname(to);
  if (!fs.existsSync(toDir)) {
    fs.mkdirSync(toDir, { recursive: true });
  }
  fs.copyFileSync(from, to);
}

/**
 * 处理 require 资源的工具函数
 * @param imageSrcValue require 引用的值
 * @param resourceFilePath 使用 require 函数的文件的路径
 * @param options 选项
 * @returns {string} 资源的 url
 */
function handler(imageSrcValue, resourceFilePath, options) {
  const { publicPath, md5Length, hook, outputPath, emitFile } = options;

  const imageFileAbsolutePath = path.resolve(
    path.dirname(resourceFilePath),
    imageSrcValue
  );
  const imageFileName = path.basename(imageFileAbsolutePath);
  const imageFileHashName = getFileHashName(imageFileAbsolutePath, md5Length);
  const imagePublicUrl = publicPath + imageFileHashName;

  if (emitFile) {
    const imageOutputPath = path.join(
      process.cwd(),
      outputPath,
      imageFileHashName
    );
    copyFileSync(imageFileAbsolutePath, imageOutputPath);
  }

  typeof hook === 'function' &&
    hook(
      imageFileName,
      imageFileAbsolutePath,
      imageFileHashName,
      imagePublicUrl
    );

  return imagePublicUrl;
}

/**
 * 默认选项
 * @type {{emitFile: boolean, md5Length: number, test: RegExp, outputPath: string, exclude: RegExp, publicPath: string}}
 */
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
