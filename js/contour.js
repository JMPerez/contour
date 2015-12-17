/*
 * sources (re-implement basic finder and then add iterative functionality?):
 * - https://github.com/Dkendal/Moore-Neighbor_Contour_Tracer/blob/master/ContourTrace.cs
 * - http://www.imageprocessingplace.com/downloads_V3/root_downloads/tutorials/contour_tracing_Abeer_George_Ghuneim/moore.html
 */
function ContourFinder() {

	this.pixelsWidth; 	// pixels width
	this.pixelsHeight;	// pixels height
	this.pixels;				// pixels (single array of r,g,b,a values of image)
	this.allContours = [];

	this.seen = [];

	this.init = function(canvas) {
		this.pixelsWidth = canvas.width;
		this.pixelsHeight = canvas.height;
		var imageCtx = canvas.getContext('2d');
		var imageData = imageCtx.getImageData(0, 0, this.pixelsWidth, this.pixelsHeight);
		this.pixels = imageData.data;
	}

	this.getPosition = function(x, y) {
		return (y * this.pixelsWidth + x) * 4;
	}

	this.getPixel = function(x, y) {
		return {
			r: this.pixels[this.getPosition(x, y)],
			g: this.pixels[this.getPosition(x, y) + 1],
			b: this.pixels[this.getPosition(x, y) + 2],
			a: this.pixels[this.getPosition(x, y) + 3]
		};
	}

	this.setPixel = function(x, y, pixel) {
		this.pixels[this.getPosition(x, y)] = pixel[0];
		this.pixels[this.getPosition(x, y) + 1] = pixel[1];
		this.pixels[this.getPosition(x, y) + 2] = pixel[2];
		this.pixels[this.getPosition(x, y) + 3] = pixel[3];
	}

	this.findContours = function() {
		// create a new pixel array

		var w = this.pixelsWidth;
		var h = this.pixelsHeight;

		var prevValue = 0;

		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var pix = this.getPixel(x, y);
				if (pix.r === 255) {
					// white, unseen

					var contour = this.followContour({ x: x, y: y });
					if (contour !== null) {
						this.allContours.push(contour);
					}
				}
			}
		}
	}

	this.markAsSeen = function(point) {
		this.seen[point.x] = this.seen[point.x] || [];
		this.seen[point.x][point.y] = true;
	};

	this.isSeen = function(point) {
		if (this.seen[point.x] && this.seen[point.x][point.y]) {
			return true;
		}
		return false;
	};

	this.followContour = function(startPoint) {

		var points = []; // start new contour
		points.push(startPoint);
		var length = 1;

		this.markAsSeen(startPoint);

		var w = this.pixelsWidth;
		var h = this.pixelsHeight;

		var point = startPoint;

		var neighborhood = [
	    { xd: -1, yd: -1}, // north-west
			{ xd: -1, yd:  1},  // south-west
			{ xd:  1, yd: -1}, // north-east
			{ xd:  1, yd:  1}, // south-east
			{ xd: -1, yd:  0}, // west
	    { xd:  0, yd: -1}, // north
			{ xd:  0, yd:  1}, // south
	    { xd:  1, yd:  0} // east
		];

		var tmpPoint = {x: point.x, y: point.y};
		var i = 0;

		var lastDirection = null;
		var pointsInLastDirection = 0;

		while (i < neighborhood.length) {
			tmpPoint.x = point.x + neighborhood[i].xd;
			tmpPoint.y = point.y + neighborhood[i].yd;
			if (!this.isSeen(tmpPoint) &&
				tmpPoint.x < w && tmpPoint.y < h &&
				!(tmpPoint.x === point.x && tmpPoint.y === point.y) &&
				this.getPixel(tmpPoint.x, tmpPoint.y).r === 255) {

				if (lastDirection === i) {
					pointsInLastDirection++;
					if (pointsInLastDirection >= 2) {
						points.pop();
					}
				} else {
					lastDirection = i;
					pointsInLastDirection = 1;
				}

				var pointToAdd = {x: tmpPoint.x, y: tmpPoint.y};
				points.push(pointToAdd);
					length++;
				this.markAsSeen(pointToAdd);
				point = {x: tmpPoint.x, y: tmpPoint.y};
				i = 0;
			} else {
				i++;
			}
		}
		if (length > 5) {
			return {
				points: points,
				length: length
			};
		}
		return null;
	}
}
