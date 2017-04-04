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

  var DIRECTIONS = {
    N: 0,
    NE: 1,
    E: 2,
    SE: 3,
    S: 4,
    SW: 5,
    W: 6,
    NW: 7,
    SAME: 8
  };

  image = document.getElementById('image');

  var dropAreaElement = document.querySelector('.main');

  var files = [
    'albums/avicii-true.jpg',
    'albums/cold-play-ghost-stories.jpg',
    'albums/daft-punk-ram.jpg',
    'albums/kanye-west-yeezus.jpg',
    'albums/michael-jackson-bad.jpg',
    'albums/nirvana-nevermind.jpg',
    'albums/the-xx-coexist.jpg'
  ];

  var currentIndex = 0;

  function nextFile() {
    if (currentIndex < files.length) {
      var file = files[currentIndex];
      dropAreaElement.classList.add('dropped');
      var image = new Image();
      image.src = file;
      image.addEventListener('load', function() {
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
        });
      }
  }

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

  function findOutDirection(point1, point2) {
    if (point2.x > point1.x) {
      if (point2.y > point1.y) {
        return DIRECTIONS.NE;
      } else if (point2.y < point1.y) {
        return DIRECTIONS.SE;
      } else {
        return DIRECTIONS.E;
      }
    } else if (point2.x < point1.x) {
      if (point2.y > point1.y) {
        return DIRECTIONS.NW;
      } else if (point2.y < point1.y) {
        return DIRECTIONS.SW;
      } else {
        return DIRECTIONS.W;
      }
    } else {
      if (point2.y > point1.y) {
        return DIRECTIONS.N;
      } else if (point2.y < point1.y) {
        return DIRECTIONS.S;
      } else {
        return DIRECTIONS.SAME;
      }
    }
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

    var optimizedPoints = [],
        direction = null;

    points.reduce(function(accumulator, currentValue, currentIndex, array) {
      if (optimizedPoints.length === 0) {
        optimizedPoints.push(currentValue);
        return null;
      } else {
        var direction = findOutDirection(currentValue, array[currentIndex - 1]);
        if (direction === DIRECTIONS.SAME) {
          return accumulator;
        }
        if (direction !== accumulator) {
          optimizedPoints.push(currentValue);
        } else {
          optimizedPoints[optimizedPoints.length -1] = currentValue;
        }
        return direction;
      }
    }, null);

    var pointsString = optimizedPoints.map(function(point) {
      return point.x + ',' + point.y;
    }).join(' ');

    var polyline = document.createElementNS('http://www.w3.org/2000/svg','polyline');
    polyline.setAttributeNS(null, 'points', pointsString.trim());

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
      setTimeout(function() {
        document.querySelector('.container img').style.opacity = 0;
        currentIndex++;
        nextFile();
      }, 2000);
    }, 2500);
  }

  nextFile();
})();
