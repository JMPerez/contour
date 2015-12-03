;(function(exports) {
  var DIRECTIONS = ["n", "e", "s", "w", "ne", "nw", "se", "sw"];

  function Pixel(i,w,h,cnvs) {
    var that = this;
    this.index = i;
    this.width = w;
    this.height = h;
    this.neighbors = [];
    this.cnvs = cnvs;

    DIRECTIONS.map(function(d,idx){
      that.neighbors.push(that[d]());
    });
  }

  /**
    This object was created to simplify getting the
    coordinates of any of the 8 neighboring pixels
    _______________
    | NW | N | NE |
    |____|___|____|
    | W  | C | E  |
    |____|___|____|
    | SW | S | SE |
    |____|___|____|
    given the index, width and height of matrix
  **/

  Pixel.prototype.n = function(){
    // pixels are simply arrays in canvas image data
    // where 1 pixel occupies 4 consecutive elements
    // equal to r-g-b-a
    return (this.index - this.width * 4);
  };

  Pixel.prototype.e = function(){
    return (this.index + 4);
  };

  Pixel.prototype.s = function(){
    return (this.index + this.width * 4);
  };

  Pixel.prototype.w = function(){
    return (this.index - 4);
  };

  Pixel.prototype.ne = function(){
    return (this.index - this.width * 4 + 4);
  };

  Pixel.prototype.nw = function(){
    return (this.index - this.width * 4 - 4);
  };

  Pixel.prototype.se = function(){
    return (this.index + this.width * 4 + 4);
  };

  Pixel.prototype.sw = function(){
    return (this.index + this.width * 4 - 4);
  };

  Pixel.prototype.r = function(){
    return this.cnvs[this.index];
  };

  Pixel.prototype.g = function(){
    return this.cnvs[this.index+1];
  };;

  Pixel.prototype.b = function(){
    return this.cnvs[this.index+2];
  };

  Pixel.prototype.a = function(){
    return this.cnvs[this.index+3];
  };

  Pixel.prototype.isBorder = function(){
    return (this.index-(this.width*4)) < 0 ||
           (this.index%(this.width*4)) === 0 ||
           (this.index%(this.width*4)) === ((this.width*4)-4) ||
           (this.index+(this.width*4)) > (this.width*this.height*4);
  };

  exports.Pixel = Pixel;
}(this));
