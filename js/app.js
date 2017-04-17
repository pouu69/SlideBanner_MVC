(function($, window){
	'use strict';

	function SliderMVC(slide, options){
		this.model = new Slider.Model({}, options);
		this.view = new Slider.View(this.model,slide);
		this.controller = new Slider.Controller(this.view, this.model);

		this.initSlide = this.controller.initSlide.bind(this.controller);
	}

  var sliderMVC = new SliderMVC($('.slide-container'),{});

	$(document).ready(function(){
		sliderMVC.initSlide({
			count: 4
		});
	});
})(jQuery, window);
