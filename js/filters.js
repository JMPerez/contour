;(function(exports) {
  function Filters(cvs) {
    this.canvas = cvs;
  }

  var calculateGray = function(pixel){
    return ((0.3 * pixel.r) + (0.59 * pixel.g) + (0.11 * pixel.b));
  };

  var generateKernel = function(sigma, size){
    var kernel = [];
    var E = 2.718;//Euler's number rounded of to 3 places
    for (var y = -(size - 1)/2, i = 0; i < size; y++, i++) {
      kernel[i] = [];
      for (var x = -(size - 1)/2, j = 0; j < size; x++, j++) {
        //create kernel round to 3 decimal places
        kernel[i][j] = 1/(2 * Math.PI * Math.pow(sigma, 2)) * Math.pow(E, -(Math.pow(Math.abs(x), 2) + Math.pow(Math.abs(y), 2))/(2 * Math.pow(sigma, 2)));
      }
    }
    //normalize the kernel to make its sum 1
    var normalize = 1/sumArr(kernel);
    for (var k = 0; k < kernel.length; k++) {
      for (var l = 0; l < kernel[k].length; l++) {
        kernel[k][l] = Math.round(normalize * kernel[k][l] * 1000)/1000;
      }
    }
    return kernel;
  };

  Filters.prototype.grayscale = function() {
    var imgDataCopy = this.canvas.getCurrImgData(),
        that = this,
        grayLevel;

    console.time('Grayscale Time');
    this.canvas.runImg(null, function(current) {
      grayLevel = calculateGray(that.canvas.getPixel(current, imgDataCopy));
      that.canvas.setPixel(current, grayLevel, imgDataCopy);
    });
    console.timeEnd('Grayscale Time');

    return imgDataCopy;
  };

  Filters.prototype.gaussianBlur = function(sigma, size) {
    var imgDataCopy = this.canvas.getCurrImgData(),
        that = this,
        kernel = generateKernel(sigma, size);

    console.time('Blur Time');
    this.canvas.runImg(size, function(current, neighbors) {
      var resultR = resultG = resultB = 0,
          pixel;
      for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
          pixel = that.canvas.getPixel(neighbors[i][j], imgDataCopy);
          resultR += pixel.r * kernel[i][j];//return the existing pixel value multiplied by the kernel
          resultG += pixel.g * kernel[i][j];
          resultB += pixel.b * kernel[i][j];
        }
      }
      that.canvas.setPixel(current, {r: resultR, g: resultG, b: resultB}, imgDataCopy);
    });
    console.timeEnd('Blur Time');

    return imgDataCopy;
  };

  Filters.prototype.invertColors = function() {
    var imgDataCopy = this.canvas.getCurrImgData(),
        that = this,
        pixel;

    console.time('Invert Colors Time');
    this.canvas.runImg(null, function(current) {
      pixel = that.canvas.getPixel(current, imgDataCopy);
      that.canvas.setPixel(current, {r: 255 - pixel.r, g: 255 - pixel.g, b: 255 - pixel.b}, imgDataCopy);
    });
    console.timeEnd('Invert Colors Time');

    return imgDataCopy;
  };

  exports.Filters = Filters;
}(this));
