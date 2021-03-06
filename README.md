# babel-plugin-transform-require-image-to-url

> 一个用于转换 `require` 引用的图片资源为 `url` 的 `babel` 插件 

![GithubAction](https://github.com/yyzclyang/babel-plugin-transform-require-image-to-url/workflows/UnitTest/badge.svg)
[![Github](https://img.shields.io/github/license/yyzclyang/babel-plugin-transform-require-image-to-url)](https://github.com/yyzclyang/babel-plugin-transform-require-image-to-url)
[![npm](https://img.shields.io/npm/v/babel-plugin-transform-require-image-to-url.svg)](https://www.npmjs.com/package/babel-plugin-transform-require-image-to-url)

## 示例

```javascript
const image = require('../path/image.png');
<img src={require('../path/image.png')} />

      ↓ ↓ ↓ ↓ ↓ ↓

const image = 'https://cdn.com/image.1ms2.png';
<img src={'https://cdn.com/image.1ms2.png'} />
```

## 安装

```bash
npm install babel-plugin-transform-require-image-to-url --save-dev

#or

yarn add -D babel-plugin-transform-require-image-to-url
```

## 用法

### 通过 .babelrc

```json
{
  "plugins": [
    [
      "transform-require-image-to-url",
      {
        "test": ".png$",
        "exclude": ".local.png$",
        "publicPath": "https://cdn.com",
        "outputPath": "dist/folder",
        "md5Length": 8
      }
    ]
  ]
}
```

### 通过 .babelrc.js

```javascript
module.exports = {
  plugins: [
    [
      'transform-require-image-to-url',
      {
        test: /\.png$/,
        exclude: /\.local\.png$/,
        publicPath: 'https://cdn.com',
        outputPath: 'dist/folder',
        md5Length: 8
      }
    ]
  ]
};
```

### 选项

#### test

> 图片资源验证器，通过验证的资源才会被转换，支持字符串（会被转为正则表达式），正则表达式和函数

例子

```javascript
module.exports = {
  plugins: [
    [
      'transform-require-image-to-url',
      {
        test: /\.png$/
        // test: '\.png$'
        // test: (imageName: string) => /\.png$/.test(imageName)
      }
    ]
  ]
};
```

这三种写法是等价的

默认的资源验证器是一个正则表达式，为 `/\.(png|jpeg|jpg|gif)$/`

#### exclude

> 资源排除验证器，通过验证的资源将不会被转换

例子

```javascript
module.exports = {
  plugins: [
    [
      'transform-require-image-to-url',
      {
        test: /\.local\.png$/
        // test: '\.local\.png$'
        // test: (imageName: string) => /\.local\.png$/.test(imageName)
      }
    ]
  ]
};
```

默认的资源验证器是一个正则表达式，为 `/\.local\.(png|jpeg|jpg|gif)$/`

#### publicPath

> 转换后图片资源 `url` 的前缀

例子

```javascript
module.exports = {
  plugins: [
    [
      'transform-require-image-to-url',
      {
        publicPath: 'https://cdn.com'
      }
    ]
  ]
};
```

#### outputPath

> 图片被转换时，拷贝到的文件夹地址

例子

```javascript
module.exports = {
  plugins: [
    [
      'transform-require-image-to-url',
      {
        outputPath: 'dist/custom/folder'
      }
    ]
  ]
};
```

默认值为 `dist/cdn-assets`

#### emitFile

> 当图片资源被转换成 `url` 时，是否需要将图片拷贝到指定的文件夹

例子

```javascript
module.exports = {
  plugins: [
    [
      'transform-require-image-to-url',
      {
        emitFile: false
      }
    ]
  ]
};
```

默认值为 `true`

#### md5Length

> 图片资源在转换后名称默认带 `md5` 值，这是设置 `md5` 值的位数

例子

```javascript
module.exports = {
  plugins: [
    [
      'transform-require-image-to-url',
      {
        publicPath: 'https://cdn.com',
        md5Length: 8 // 默认是 4 位
      }
    ]
  ]
};
```

图片转换后的 `url` 类似为 `https://cdn.com/image.1ms2md3j.png`

#### hook

> 图片资源被转换时执行的钩子函数 

例子

```javascript
module.exports = {
  plugins: [
    [
      'transform-require-image-to-url',
      {
        publicPath: 'https://cdn.com',
        hook: (fileName, filePath, hashFileName, imagePublicUrl) => {
          // 你可以在图片转换时做一些事
        }
      }
    ]
  ]
};
```
