(function($, window){
	'use strict';

	function SliderMVC(){
    var me = this;

		me.model = new Slider.Model();
		me.view = new Slider.View(me.model);
		me.controller = new Slider.Controller(me.view, me.model);

		me.initSlide = me.controller.initSlide.bind(me.controller);

    if (!(me instanceof SliderMVC)) {
        return new SliderMVC();
    }

		return me;
	}

	window.SliderMVC = SliderMVC;
})(jQuery, window);
