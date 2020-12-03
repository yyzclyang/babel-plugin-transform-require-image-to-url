# babel-plugin-transform-require-image-to-string

> Babel plugin that transforms image assets requires to url

![GithubAction](https://github.com/yyzclyang/babel-plugin-transform-require-image-to-string/workflows/UnitTest/badge.svg)
[![Github](https://img.shields.io/github/license/yyzclyang/babel-plugin-transform-require-image-to-string.svg)](https://github.com/yyzclyang/babel-plugin-transform-require-image-to-string)
[![npm](https://img.shields.io/npm/v/babel-plugin-transform-require-image-to-string.svg)](https://www.npmjs.com/package/babel-plugin-transform-require-image-to-string)

## Example

```javascript
const image1 = require('../path/image.png');
const image2 = require('../path/image.png').default;
<img src={require('../path/image.png')} />
<img src={require('../path/image.png').default} />

      ↓ ↓ ↓ ↓ ↓ ↓

const image1 = 'https://cdn.com/image.1ms2.png';
const image2 = 'https://cdn.com/image.1ms2.png';
<img src={'https://cdn.com/image.1ms2.png'} />
<img src={'https://cdn.com/image.1ms2.png'} />
```

## Installation

```bash
npm install babel-plugin-transform-require-image-to-string --save-dev

#or

yarn add -D babel-plugin-transform-require-image-to-string
```

## Usage

### via .babelrc

```json
{
  "plugins": [
    [
      "transform-require-image-to-string",
      {
        "test": ".png$",
        "publicPath": "https://cdn.com",
        "md5": 8
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
      'transform-require-image-to-string',
      {
        test: /\.png$/,
        publicPath: 'https://cdn.com',
        md5: 8
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
      'transform-require-image-to-string',
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

#### publicPath

> The cdn address of the image resource

e.g.

```javascript
module.exports = {
  plugins: [
    [
      'transform-require-image-to-string',
      {
        publicPath: 'https://cdn.com'
      }
    ]
  ]
};
```

#### md5

> The length of the md5 value in the image name

e.g.

```javascript
module.exports = {
  plugins: [
    [
      'transform-require-image-to-string',
      {
        publicPath: 'https://cdn.com',
        md5: 8 // default 4
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
      'transform-require-image-to-string',
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
