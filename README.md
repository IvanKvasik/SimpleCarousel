# SimpleCarousel

#### Simple carousel - Pure JS module that will help you add easy customizable carousel on your website

### Usage

Include SimpleCarousel style in `<head>`:
```html
<link rel="stylesheet" href="SimpleCarousel.css">
```
Include your script as a module in the end of `<body>`:
```html
<script src="script.js" type="module"></script>
```
Import SimpleCarousel class from SimpleCarousel.js:
```javascript
import SimpleCarousel from '/SimpleCarousel.js';
```
### SimpleCarousel class
```javascript
new SimpleCarousel(slider, options).start();
```
`slider` *(required)* - slider DOM element

`options` *(optional)* - options object

`.start()` *(required for working)* - starts controls listening

`shownSlides` - shownSlides option's setter

#### Options

`outerClasses` *(optional)* - array of additional classes for outer block

`shownSlides` *(optional: default - 1)* - number of slides shown at the same time

`arrowLeft` *(optional)* - switch to the previous slide DOM element

`arrowRight` *(optional)* - switch to the next slide DOM element

`swipeable` *(optional: default - true)* - whether slider is swipeable

`infinite` *(optional: default - false)* - whether slider is infinite

`speed` *(optional: default - 1.5)* - slide changing's speed

`markers` *(optional)* - markers DOM element

### Example

#### HTML:

```html
<div id="slider">
	<div class="slide">1</div>
	<div class="slide">2</div>
	<div class="slide">3</div>
	<div class="slide">4</div>
	<div class="slide">5</div>
	<div class="slide">6</div>
</div>
<div id="controls">
	<button id="left"><<</button>
	<button id="right">>></button>
</div>
<div class="markers"></div>
```
#### JavaScript:

```javascript
import SimpleCarousel from '/SimpleCarousel.js';
new SimpleCarousel(document.getElementById('slider'), {
	outerClasses: ['class1', 'class2'],
	shownSlides: 3,
	arrowLeft: document.getElementById('left'),
	arrowRight: document.getElementById('right'),
	swipeable: true,
	infinite: true,
	speed: 1.5,
	markers: document.querySelector('.markers'),
}).start();
```
