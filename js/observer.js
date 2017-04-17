(function($, window){
  'user strict';

  function Observer(){
    this.$listeners = $(this);
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
