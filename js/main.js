var image;
var imageCtx;
var contour;
var contourCtx;
var foregroudColor = 255;
var backgroundColor = 0;
var threshold = 125; 
var contourFinder = new ContourFinder();

$( document ).ready(function() {
	console.log( "ready!" );
	image = document.getElementById('image');
	imageCtx = image.getContext('2d');
	contour = document.getElementById('contour');
	contourCtx = contour.getContext('2d');

	fillImage();
	// ToDo: try edge detection filter
	// ToDo: preprocess: threshold
	contourFinder.findContours(image,foregroudColor,backgroundColor,threshold);
});

function fillImage() {
	imageCtx.clearRect (0,0,image.width,image.height);

	imageCtx.fillStyle = "#000000";
	imageCtx.fillRect(0, 0, image.width, image.height);
	imageCtx.fillStyle = "#ffffff";
	imageCtx.fillRect(0, 0, 4, 3);
}

function drawContours() {
}
