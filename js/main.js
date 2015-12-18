(function() {
  var image;
  var contourFinder;
  var startTime = 0;
  var maxResolution = 400;

  var resultWidth;
  var resultHeight;

  var imageWidth;

  var filters,
      canny,
      canvas;

  image = document.getElementById('image');

  var dropAreaElement = document.querySelector('.main');
  var imageProvider = new ImageProvider({
    element: dropAreaElement,
    onImageRead: function(image) {
      dropAreaElement.classList.add('dropped');
      imageWidth = image.width;
      if (image.width > image.height) {
        resultWidth = Math.min(image.width, maxResolution);
        resultHeight = parseInt(resultWidth * image.height / image.width, 10);
      } else {
        resultHeight = Math.min(image.height, maxResolution);
        resultWidth = parseInt(resultHeight * image.width / image.height, 10);
      }
      contourFinder = new ContourFinder();
      canvas = new Canvas('canvas', resultWidth, resultHeight);
      canny = new Canny(canvas);
      filters = new Filters(canvas);

      image.style.opacity = 0;

      // delete previous images
      var prev = document.querySelector('.container img');
      if (prev) {
        prev.parentNode.removeChild(prev);
      }

      var polylines = document.querySelectorAll('#svg2 polyline');
      if (polylines.length) {
        for (var i = 0; i < polylines.length; i++) {
          polylines[i].parentNode.removeChild(polylines[i]);
        }
      }

      document.querySelector('.container')
        .appendChild(image);

      canvas.loadImg(image.src, 0, 0, resultWidth, resultHeight).then(process);
    }
  });

  imageProvider.init();


  function process() {
    startTime = Date.now();

    canvas.setImgData(filters.grayscale());
    canvas.setImgData(filters.gaussianBlur(5, 1));

    canvas.setImgData(canny.gradient('sobel'));
    canvas.setImgData(canny.nonMaximumSuppress());
    canvas.setImgData(canny.hysteresis());

    contourFinder.init(canvas.getCanvas());
    contourFinder.findContours();

    console.log('contourFinder.allContours.length): ' + contourFinder.allContours.length);
    var secs = (Date.now() - startTime) / 1000;
    console.log('Finding contours took ' + secs + 's');

    drawContours();
  }

  function drawContours() {
    for (var i = 0; i < contourFinder.allContours.length; i++) {
      console.log('contour #' + i + ' length: ' + contourFinder.allContours[i].length);
      drawContour(i);
    }
    animate();
  }

  function drawContour(index) {
    var points = contourFinder.allContours[index];

    var pointsString = '';
    for (var i = 0; i < points.length; i+= 2) {
      pointsString += (points[i].x + 1) + ',' + points[i].y + '  ';
    }

    var polyline = document.createElementNS('http://www.w3.org/2000/svg','polyline');
    polyline.setAttributeNS(null, 'points', pointsString.trim());
    polyline.setAttributeNS(null, 'stroke', '#ffffff');
    polyline.setAttributeNS(null, 'stroke-width', 1);
    polyline.setAttributeNS(null, 'stroke-linecap', 'round');
    polyline.setAttributeNS(null, 'opacity', 1);
    polyline.setAttributeNS(null, 'stroke-dashoffset', 0);
    polyline.setAttributeNS(null, 'fill', 'none');

    var svg = document.querySelector('#svg2');
    svg.appendChild(polyline);
    svg.setAttribute('viewBox', '0 0 ' + resultWidth + ' ' + resultHeight);
    svg.setAttribute('style', 'width:' + imageWidth + 'px');
  }

  function animate() {
    var polylines = document.querySelectorAll('#svg2 polyline');
    [].forEach.call(polylines, function(polyline, index) {
      var length = contourFinder.allContours[index].length;
      // Clear any previous transition
      polyline.style.transition = polyline.style.WebkitTransition =
        'none';

      // Set up the starting positions
      polyline.style.strokeDasharray = length + ' ' + length;
      polyline.style.strokeDashoffset = length;
      // Trigger a layout so styles are calculated & the browser
      // picks up the starting position before animating
      polyline.getBoundingClientRect();
      // Define our transition
      polyline.style.transition = polyline.style.WebkitTransition =
        'stroke-dashoffset 2s linear';
      // Go!
      polyline.style.strokeDashoffset = '0';
    });

    setTimeout(function() {
      document.querySelector('.container img').style.opacity = 1;
      document.querySelector('.container svg').style.opacity = 0;
    }, 2500);
  }
})();
