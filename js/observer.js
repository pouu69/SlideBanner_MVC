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
    /**
     * 옵저버에 Custom Event 등록
     * @param {string}   event    Custom Event명
     * @param {function} callback 콜백 함수
     * @public
     */
    subscribe: function(event, callback){
      this.$listeners.on(event, callback);
    },

    /**
     * 옵저버에 Custom Event 삭제
     * @param {string} event Custom Event명
     * @public
     */
    unsubscribe: function(event){
      this.$listeners.off(event);
    },

    /**
     * 옵저버에 Custom Event 실행
     * @param {string}       event Custom Event명
     * @param {string|array} args 전달할 파라미터
     * @public
     */
    notify: function(event, args){
      this.$listeners.trigger(event, args);
    }
  }

  window.Slider = window.Slider || {};
  window.Slider.Observer = Observer;
})(jQuery, window);
