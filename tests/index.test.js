const path = require('path');
const { transformCode, getFixtures } = require('./util');

describe('index', () => {
  test('should replace require (png、jpeg、jpg、gif) with uri by default', () => {
    const pngResult = transformCode(getFixtures('require-png.js'), {}).code;
    expect(pngResult).toEqual(`const test = "test.ed8f.png";`);
    const jpegResult = transformCode(getFixtures('require-jpeg.js'), {}).code;
    expect(jpegResult).toEqual(`const test = "test.1a19.jpeg";`);
    const jpgResult = transformCode(getFixtures('require-jpg.js'), {}).code;
    expect(jpgResult).toEqual(`const test = "test.ee0f.jpg";`);
    const gifResult = transformCode(getFixtures('require-gif.js'), {}).code;
    expect(gifResult).toEqual(`const test = "test.6d82.gif";`);
  });

  test('should replace require image with uri when set md5', () => {
    const result1 = transformCode(getFixtures('require-png.js'), { md5: 0 })
      .code;
    expect(result1).toEqual(`const test = "test.png";`);
    const result2 = transformCode(getFixtures('require-png.js'), { md5: 8 })
      .code;
    expect(result2).toEqual(`const test = "test.ed8ff136.png";`);
  });

  test('should replace require image with uri when set publicPath', () => {
    const result = transformCode(getFixtures('require-png.js'), {
      publicPath: 'https://cdn.com/images/'
    }).code;
    expect(result).toEqual(
      `const test = "https://cdn.com/images/test.ed8f.png";`
    );
  });

  test('should replace require image with uri when set customize validator', () => {
    const result1 = transformCode(getFixtures('require-png.js'), {
      publicPath: 'https://cdn.com/images/',
      test: '.customize$'
    }).code;
    expect(result1).toEqual(
      `const test = require('../../some/assets/deep/folder/assets/path/to/test.png');`
    );
    const result2 = transformCode(getFixtures('require-customize.js'), {
      publicPath: 'https://cdn.com/images/',
      test: /\.customize$/
    }).code;
    expect(result2).toEqual(
      `const test = "https://cdn.com/images/test.7487.customize";`
    );
    const result3 = transformCode(getFixtures('require-customize.js'), {
      publicPath: 'https://cdn.com/images/',
      test: fileName => {
        return /test\.customize$/.test(fileName);
      }
    }).code;
    expect(result3).toEqual(
      `const test = "https://cdn.com/images/test.7487.customize";`
    );
    const result4 = transformCode(getFixtures('require-customize.js'), {
      publicPath: 'https://cdn.com/images/',
      test: 1
    }).code;
    expect(result4).toEqual(
      `const test = require('../../some/assets/deep/folder/assets/path/to/test.customize');`
    );
  });

  test('should do nothing when set exclude', function () {
    const result = transformCode(getFixtures('require-exclude-asset.js'), {
      exclude: /\.exclude\.(png|jpeg|jpg|gif)$/
    }).code;
    expect(result).toEqual(
      "const test = require('../../some/assets/deep/folder/assets/path/to/test.exclude.jpg');"
    );
  });

  test('should do nothing when not a require assignment', function () {
    const result = transformCode(getFixtures('require-var.js')).code;
    expect(result).toEqual("const test = 'something';");
  });

  test('should do nothing when require not a string assignment', function () {
    const result = transformCode(getFixtures('require-not-string.js')).code;
    expect(result).toEqual('const test = require(123);');
  });

  test('the hook should be executed when the hook is set', function () {
    const fn = jest.fn();
    transformCode(getFixtures('require-jpg.js'), {
      publicPath: 'https://cdn.com/',
      hook: fn
    }).code;

    expect(fn).toHaveBeenCalledWith(
      'test.jpg',
      path.resolve(
        __dirname,
        './fixtures',
        '../../some/assets/deep/folder/assets/path/to/test.jpg'
      ),
      'test.ee0f.jpg',
      'https://cdn.com/test.ee0f.jpg'
    );
  });
});
