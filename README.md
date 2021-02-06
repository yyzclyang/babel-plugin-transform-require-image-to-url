# babel-plugin-transform-require-image-to-url

> Babel plugin that transforms image assets requires to url

![GithubAction](https://github.com/yyzclyang/babel-plugin-transform-require-image-to-url/workflows/UnitTest/badge.svg)
[![Github](https://img.shields.io/github/license/yyzclyang/babel-plugin-transform-require-image-to-url)](https://github.com/yyzclyang/babel-plugin-transform-require-image-to-url)
[![npm](https://img.shields.io/npm/v/babel-plugin-transform-require-image-to-url.svg)](https://www.npmjs.com/package/babel-plugin-transform-require-image-to-url)

## Example

```javascript
const image = require('../path/image.png');
<img src={require('../path/image.png')} />

      ↓ ↓ ↓ ↓ ↓ ↓

const image = 'https://cdn.com/image.1ms2.png';
<img src={'https://cdn.com/image.1ms2.png'} />
```

## Installation

```bash
npm install babel-plugin-transform-require-image-to-url --save-dev

#or

yarn add -D babel-plugin-transform-require-image-to-url
```

## Usage

### via .babelrc

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

### via .babelrc.js

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

### options

#### test

> Image resource validator, support string, regexp and function

e.g.

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

The above three writings are equivalent

The default validator is a regexp, which is `/\.(png|jpeg|jpg|gif)$/`

#### exclude

> Image resource validator, Exclude images that do not need to be converted

e.g.

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

The default validator is a regexp, which is `/\.local\.(png|jpeg|jpg|gif)$/`

#### publicPath

> The cdn address of the image resource

e.g.

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

> The path to which the image was copied when it was converted

e.g.

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

The default path is `dist/cdn-assets`

#### emitFile

> Whether the image is copied to the specified path when converted

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

The default value is `true`

#### md5Length

> The length of the md5 value in the image name

e.g.

```javascript
module.exports = {
  plugins: [
    [
      'transform-require-image-to-url',
      {
        publicPath: 'https://cdn.com',
        md5Length: 8 // default 4
      }
    ]
  ]
};
```

The cdn picture address is `https://cdn.com/image.1ms2md3j.png`

#### hook

> The hook executed when the image resource is converted

e.g.

```javascript
module.exports = {
  plugins: [
    [
      'transform-require-image-to-url',
      {
        publicPath: 'https://cdn.com',
        hook: (fileName, filePath, hashFileName, imagePublicUrl) => {
          // you can do something
        }
      }
    ]
  ]
};
```

The cdn picture address is `https://cdn.com/image.1ms2md3j.png
