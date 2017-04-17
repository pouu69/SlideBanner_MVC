(function($, window){
  'user strict';

  function Observer(){
    var self = this;

    self.$listeners = $(self);

    if (!(self instanceof Slider.Observer)) {
        return new Slider.Observer();
    }

		return self;

  }

  Observer.prototype = {
    subscribe: function(event, callback){
      this.$listeners.on(event, callback);
    },

    unsubscribe: function(event){
      this.$listeners.off(event);
    },

    notify: function(event){
      this.$listeners.trigger(event);
    }
  }

  window.Slider = window.Slider || {};
  window.Slider.Observer = Observer;
})(jQuery, window);
