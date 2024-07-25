'use strict';
export default class SimpleCarousel{
	constructor(slider, options = {}){
		this._slider = slider;
		this._slider.classList.add('slider');
		this._options = options;
		if(typeof this._options.outerClasses === "undefined") this._options.outerClasses = [];
		if(typeof this._options.shownSlides === "undefined") this._options.shownSlide = 1;
		if(typeof this._options.swipeable === "undefined") this._options.swipeable = true;
		if(typeof this._options.infinite === "undefined") this._options.infinite = true;
		if(typeof this._options.speed === "undefined") this._options.speed = 1.5;
		this._currentSlide = 0;
		this._slidesNumber = this._slider.children.length;

		this._setSlideWidth();
		this._setIndexes();

		if(this._options.markers){
			this._options.markers.classList.add('slider_markers');
			this._renderMarkers();
		}

		if(this._slidesNumber <= this._options.shownSlides){
			this._addSlides();
		}
		this._slider.firstElementChild.classList.add('current_slide');

		this._addSliderOuter();
	}

	_addSlides(){
		let added_packs = Math.floor((this._options.shownSlides - this._slidesNumber)/this._slidesNumber)+1;
		for(let sl = 0;sl < added_packs*this._slidesNumber;sl++){
			this._slider.append(this._slider.children[sl].cloneNode(true));

		}
		this._slidesNumber += added_packs*this._slidesNumber;
	}

	_setIndexes(){
		Array.from(this._slider.children).forEach((slide, ind) => {
			slide.dataset.index = ind;
		});
	}

	_setSlideWidth(){
		Array.from(this._slider.children).forEach((slide, ind) => {
			slide.style.minWidth = `${this._slideWidth}%`;
		});
	}

	_addSliderOuter(){
		let outer = document.createElement('div');
		outer.classList.add('slider_outer', ...this._options.outerClasses);
		this._slider.parentNode.insertBefore(outer, this._slider);
		outer.append(this._slider);
	}

	get _slide(){
		return this._slider.children[Math.abs(this._currentSlide)].dataset.index;
	}

	get _sliderWidth(){
		return this._slider.parentNode.clientWidth;
	}

	get _gap(){
		let gap = parseInt(getComputedStyle(this._slider).gap) * 100 / this._sliderWidth;
		if(isNaN(gap)) gap = 0;
		return gap;
	}

	get _scrollWidth(){
		return this._slideWidth + this._gap;
	}

	get _slideWidth(){
		return 100/this._options.shownSlides;
	}

	set shownSlides(value){
		this._options.shownSlides = value;
		this._setSlideWidth();
	}

	_getTranslateX(){
		let style = getComputedStyle(this._slider);
		let matrix = new WebKitCSSMatrix(style.transform);
		return matrix.m41;
	}

	_animateTransform(end){
 		let progress = this._getTranslateX() * 100 / this._sliderWidth
		let change = end > progress ? this._options.speed : -this._options.speed;

		let loop = () => {
			if(change > 0){
				progress += Math.min(change, end - progress);
			}else{
				progress += Math.max(change, end - progress);
			}
			this._slider.style.transform = `translateX(${progress}%)`;
			if(progress != end) requestAnimationFrame(loop);
		}
		requestAnimationFrame(loop);
	}

	_changeSlide(direction){
		this._slider.children[-this._currentSlide].classList.remove('current_slide');
		if(direction == 'right'){
			//next slide does not exist and ifinite slider
			if(-this._currentSlide == this._slidesNumber - this._options.shownSlides && this._options.infinite){
				this._slider.append(this._slider.firstElementChild.cloneNode(true));
				this._slider.removeChild(this._slider.firstElementChild);

				//translate current slide in the visible zone
				this._slider.style.transform = `translateX(${(this._currentSlide+1)*this._scrollWidth}%)`;
			}else if(-this._currentSlide != this._slidesNumber - this._options.shownSlides){ //next slide exists
				this._currentSlide--;
			}
		}else if(direction == 'left'){
			if(!this._currentSlide && this._options.infinite){ //previous slide does not exist and ifinite slider
				this._slider.prepend(this._slider.lastElementChild.cloneNode(true));
				this._slider.removeChild(this._slider.lastElementChild);
					
				//translate current slide in the visible zone
				this._slider.style.transform = `translateX(${(this._currentSlide-1)*this._scrollWidth}%)`;
			}else if(this._currentSlide){ //previous slide exists
				this._currentSlide++;
			}
		}
		setTimeout(() => {
			this._slider.children[-this._currentSlide].classList.add('current_slide');
			let end = this._currentSlide * this._scrollWidth;
			this._animateTransform(end); //move to the next slide
		});
		//change active marker
		if(this._options.markers){
			this._options.markers.querySelector('.active_marker').classList.remove('active_marker');
			let newActiveMarker = this._slide;
			console.log(newActiveMarker);
			this._options.markers.children[newActiveMarker].classList.add('active_marker');
		}
	}

	_handleSwipe(){
		let downX, downY
		this._slider.addEventListener('touchstart', (e) => {	
			downX = e.touches[0].clientX;
			downY = e.touches[0].clientY;

			//set touchstart coordinates
		});

		this._slider.addEventListener('touchend', (e) => {
			let slideWidthInPixels = this._sliderWidth * this._scrollWidth/100;
			let upX = e.changedTouches[0].clientX;
			let upY = e.changedTouches[0].clientY;

			//handling only horizontal swipe
			if(Math.abs(downY - upY) < Math.abs(downX - upX)){

				//swiped to the left
				if(downX - upX >= slideWidthInPixels * 0.15){
					this._changeSlide('right');
				}

				//swiped to the right
				else if(downX - upX <= -slideWidthInPixels * 0.15){
					this._changeSlide('left');
				}
			}
		});
	}

	_renderMarkers(){
		//one marker for every shown slides group
		for(let i = 0;i < this._slidesNumber;i++){
			let newMarker = document.createElement('div');
			newMarker.classList.add('marker');
			if(!i) newMarker.classList.add('active_marker');
			newMarker.dataset.index = i;
			this._options.markers.append(newMarker);
		}
	}

	_handleMarker(){
		let markers = Array.from(this._options.markers.children);
		markers.forEach(marker => {
			marker.addEventListener('click', () => {
				let activeMarker = this._options.markers.querySelector('.active_marker');
				let slidesToChange = marker.dataset.index - this._slide;
				let changeDirection = marker.dataset.index > activeMarker.dataset.index ? 'right' : 'left';
				if(!marker.classList.contains('active_marker')){
					for(let i = 0;i < Math.abs(slidesToChange);i++){
						this._changeSlide(changeDirection);
					}
				}
			});
		});
	}

	start(){
		if(this._options.arrowLeft) this._options.arrowLeft.addEventListener('click', () => this._changeSlide('left'));
		if(this._options.arrowRight) this._options.arrowRight.addEventListener('click', () => this._changeSlide('right'));
		if(this._options.swipeable) this._handleSwipe();
		if(this._options.markers) this._handleMarker();
	}
};
