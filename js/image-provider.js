var ImageProvider = function(options) {
  this._options = options;
};

ImageProvider.prototype.init = function() {
  var element = this._options.element;
  element.addEventListener('drop', this._handleDrop.bind(this), false);
  element.addEventListener('dragover', this._fileDragHover.bind(this), false);
};

  // file drag hover
ImageProvider.prototype._fileDragHover = function(e) {
  e.stopPropagation();
  e.preventDefault();
};

ImageProvider.prototype._handleDrop = function(e) {
  e.preventDefault();
  e.stopPropagation();
  this._readDataFile(e.dataTransfer.files[0])
};

ImageProvider.prototype._readDataFile = function(e) {
  var self = this;
  var a = new FileReader();
  a.onloadend = function(f) {
    var resultImage = new Image();
    resultImage.onload = function() {
      self._options.onImageRead(resultImage);
    }
    resultImage.id = 'result';
    resultImage.src = a.result;
  };
  a.readAsDataURL(e);
};
