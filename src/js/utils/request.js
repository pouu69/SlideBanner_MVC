(function($, window, Slider){
  function Request(){
    var self = this;

    if (!(self instanceof Slider.Request)) {
        return new Slider.Request();
    }

		return self;
  }

  Request.prototype = {
    /**
     * 데이터 fetch
     * @param  {object} options 전달할 파라미터
     * @return {object}         Promise 객체
     * @public
     */
    fetch: function(options){
      return $.ajax(options)
            .done($.proxy(this._successHandler, this))
            .fail(this._failureHandler);
    },

    /**
     * fetch 성공 핸들러
     * @param  {array} data 결과 데이터
     * @return {array}      결과 Mock데이터
     * @private
     */
    _successHandler: function(data){
      return data;
    },

    /**
     * fetch 실패시
     * @return {boolean} false
     * @private
     */
    _failHandler: function(){
      window.alert('Error Request.');
      return false;
    }
  }

  Slider.Request = Request;
})(jQuery, window || {}, Slider || {});
