# contour - Draw an image with SVG

Drag and drop an image to the drop area and you will see it "drawn" using SVG.

![Demo](https://jmperezperez.com/assets/images/posts/contour.gif)

This project is inspired by Polygon's [Xbox One](http://www.polygon.com/a/xbox-one-review) and [PS4](http://www.polygon.com/a/ps4-review) reviews. In those pages, they animate a SVG to create a nice drawing effect.

Sure, the trick works for SVG files, but what about bitmap files? By using an edge detector algorithm we can trace the main edges of an image and animate them. The generated SVG is composed of multiple `polyline`s, which are animated using JS and CSS. The resulting SVG is so small (in the order of a handful kBs) that can be inlined in the HTML and be used as a placeholder while loading in parallel the large bitmap image.

See [this blog post](https://jmperezperez.com/drawing-edges-svg/) for more information on the technique.

### Some ideas on what to do with the SVG

There are some interesting properties:
- SVGs can be precalculated server-side, then inlined in the HTML. [svgo](https://github.com/svg/svgo) can be used to further optimize the SVG (in my tests the reduction is close to 60%). In this case we would animate `path`s instead of `polyline`s (see [this pen](http://codepen.io/jmperez/pen/rxxRRg) as an example of animating paths.
- The SVG version of the image can be generated from a smaller version of the image. It will still contain enough details and the SVG will contain less points and their value will use smaller numbers.
- The amount of detail can be easily tweaked by pruning polylines with an amount of points below a certain threshold.

### Example output

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64">
  <polyline points="51,1 61,1 61,2 56,4 56,3"/>
  <polyline points="52,1 50,2 51,3 50,4 50,9 46,10 46,8 48,8 48,9"/>
  <polyline points="61,4 61,5 58,6"/>
  <polyline points="19,5 25,5 26,6 27,6 27,7 28,8 29,8 29,12 28,13 28,18"/>
  <polyline points="20,5 16,7 16,8 14,10 14,14 13,15 13,19 14,20 6,26 6,28 5,29 5,31 4,32 4,38 3,39 3,42 2,43 2,47 3,48 3,49 4,50 4,51 5,52 6,52 6,53 7,54 7,55 8,56 10,56 11,55 11,54 8,51"/>
  <polyline points="61,6 61,9 60,10 60,15 61,16 61,17 60,18 58,17"/>
  <polyline points="37,9 38,9 39,10 41,10 42,9 43,9 42,10"/>
  <polyline points="40,10 40,11 37,12"/>
  <polyline points="47,10 46,11 47,12 48,11 48,12 47,13 47,17 48,18 50,18 50,30"/>
  <polyline points="50,10 50,15"/>
  <polyline points="20,11 25,11 25,12 26,13 23,14 21,13"/>
  <polyline points="21,11 18,13 18,15 17,16 16,15"/>
  <polyline points="35,12 35,19"/>
  <polyline points="42,12 42,13 45,13 43,15 43,17 42,18 40,17 37,18 37,14 40,14"/>
  <polyline points="56,12 57,12 58,13 55,15 54,14 54,13"/>
  <polyline points="18,16 17,17 17,18 18,19 17,20 17,26 18,27 19,27 19,28"/>
  <polyline points="26,16 24,17 24,19 25,20 27,20 27,21"/>
  <polyline points="49,18 44,20"/>
  <polyline points="21,20 20,21 21,22 23,22 24,21 25,21 23,23 23,27 24,28 24,30"/>
  <polyline points="57,20 60,20 61,21 57,22"/>
  <polyline points="29,21 30,21 31,22 34,22 34,23 35,24 36,24 36,25 37,26 37,27 36,28 37,29 37,30 38,31 38,32 39,33 39,42 38,43 38,44 34,46 34,47 29,49 29,51"/>
  <polyline points="32,22 28,24"/>
  <polyline points="61,22 61,23 53,24"/>
  <polyline points="61,24 61,28 52,29"/>
  <polyline points="27,26 28,26 28,27 27,28 26,27"/>
  <polyline points="52,26 59,26"/>
  <polyline points="18,29 17,30 18,31 19,31 20,30 20,31"/>
  <polyline points="15,30 15,33 16,34 16,35"/>
  <polyline points="51,32 50,33 50,52 51,53 50,54 50,59 51,60 53,60 55,58 58,58 59,59 60,59 61,58 60,57 60,54 55,53"/>
  <polyline points="56,33 60,33 61,34 55,35"/>
  <polyline points="61,35 61,36 56,37"/>
  <polyline points="61,37 61,38 56,39"/>
  <polyline points="14,39 13,40 13,42 12,43 12,47 13,48 11,49 9,47 9,45 10,44 10,42 11,41 11,40"/>
  <polyline points="7,40 6,41 6,43 4,44"/>
  <polyline points="18,40 18,41 15,42"/>
  <polyline points="31,40 32,40 32,41 29,43 29,41"/>
  <polyline points="60,41 60,42 59,43 60,44 61,44 61,48 59,50 56,49 55,50 57,52"/>
  <polyline points="54,42 57,42 57,43 54,45 54,43"/>
  <polyline points="37,45 37,48 35,50 35,51 34,52 31,51 31,52 30,53"/>
  <polyline points="25,52 26,52 26,53 25,54 24,53 19,54 19,55 20,56 22,56 23,55 23,57"/>
  <polyline points="35,52 32,55 32,56 26,58 26,56 25,55"/>
  <polyline points="12,54 14,54 14,55"/>
  <polyline points="16,55 16,56 17,56 17,58 15,59 15,58"/>
  <polyline points="10,56 10,57 11,57 11,58 12,59 13,58"/>
  <polyline points="31,57 31,58 32,59 32,62"/>
  <polyline points="28,58 28,61 26,62 24,61 25,60 22,59 20,61 20,62"/>
  <polyline points="62,58 61,59 61,60 50,62 50,61 51,61"/>
</svg>
```

Same output, optimized using `svgo`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path d="M51 1h10v1l-5 2V3"/>
  <path d="M52 1l-2 1 1 1-1 1v5l-4 1V8h2v1M61 4v1l-3 1M19 5h6l1 1h1v1l1 1h1v4l-1 1v5"/>
  <path d="M20 5l-4 2v1l-2 2v4l-1 1v4l1 1-8 6v2l-1 1v2l-1 1v6l-1 1v3l-1 1v4l1 1v1l1 1v1l1 1h1v1l1 1v1l1 1h2l1-1v-1l-3-3M61 6v3l-1 1v5l1 1v1l-1 1-2-1M37 9h1l1 1h2l1-1h1l-1 1M40 10v1l-3 1M47 10l-1 1 1 1 1-1v1l-1 1v4l1 1h2v12M50 10v5M20 11h5v1l1 1-3 1-2-1"/>
  <path d="M21 11l-3 2v2l-1 1-1-1M35 12v7M42 12v1h3l-2 2v2l-1 1-2-1-3 1v-4h3M56 12h1l1 1-3 2-1-1v-1M18 16l-1 1v1l1 1-1 1v6l1 1h1v1M26 16l-2 1v2l1 1h2v1M49 18l-5 2M21 20l-1 1 1 1h2l1-1h1l-2 2v4l1 1v2M57 20h3l1 1-4 1M29 21h1l1 1h3v1l1 1h1v1l1 1v1l-1 1 1 1v1l1 1v1l1 1v9l-1 1v1l-4 2v1l-5 2v2M32 22l-4 2M61 22v1l-8 1M61 24v4l-9 1M27 26h1v1l-1 1-1-1M52 26h7M18 29l-1 1 1 1h1l1-1v1M15 30v3l1 1v1M51 32l-1 1v19l1 1-1 1v5l1 1h2l2-2h3l1 1h1l1-1-1-1v-3l-5-1M56 33h4l1 1-6 1M61 35v1l-5 1M61 37v1l-5 1M14 39l-1 1v2l-1 1v4l1 1-2 1-2-2v-2l1-1v-2l1-1v-1M7 40l-1 1v2l-2 1M18 40v1l-3 1"/>
  <path d="M31 40h1v1l-3 2v-2M60 41v1l-1 1 1 1h1v4l-2 2-3-1-1 1 2 2M54 42h3v1l-3 2v-2M37 45v3l-2 2v1l-1 1-3-1v1l-1 1M25 52h1v1l-1 1-1-1-5 1v1l1 1h2l1-1v2M35 52l-3 3v1l-6 2v-2l-1-1M12 54h2v1M16 55v1h1v2l-2 1v-1M10 56v1h1v1l1 1 1-1M31 57v1l1 1v3M28 58v3l-2 1-2-1 1-1-3-1-2 2v1M62 58l-1 1v1l-11 2v-1h1"/>
</svg>
```

## Libraries/Projects used to develop this

- [Canny Edge Detector](http://canny-edge-detection.herokuapp.com/)
- [Doodle3D/Contour-finding-experiment](https://github.com/Doodle3D/Contour-finding-experiment)
- [JMPerez/spotify-logo-svg-drawing-animation](https://github.com/JMPerez/spotify-logo-svg-drawing-animation)

## TODO

- Add a slider to be able to navigate to a specific moment during the transition (something like http://codepen.io/sdras/full/JdJgrB/ or http://codepen.io/ihatetomatoes/pen/PPwqMN)
