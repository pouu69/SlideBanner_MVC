(function($, window){
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
      var dfd = $.Deferred();

      return dfd.resolve(this._successHandler(options));
    },

    /**
     * fetch 성공 핸들러
     * @param  {object} options 전달할 파라미터
     * @return {array}          결과 Mock데이터
     * @private
     */
    _successHandler: function(options){
      var device = this._getParameterByName('device',options.url);
      if(device === 'mobile'){
        return [
          {
            "image": "https://cdn.lezhin.com/v2/inventory_items/6272864723140608/media/upperBannerMobile",
            "link": "http://www.naver.com"
          },
          {
            "image": "https://cdn.lezhin.com/v2/inventory_items/4537033910124544/media/upperBannerMobile",
            "link": "http://www.naver.com"
          },
          {
            "image": "https://cdn.lezhin.com/v2/inventory_items/5439666241929216/media/upperBannerMobile",
            "link": "http://www.naver.com"
          },
          {
            "image": "https://cdn.lezhin.com/v2/inventory_items/6120926790549504/media/upperBannerMobile",
            "link": "http://www.naver.com"
          }
        ];
      }else if(device === 'desktop'){
        return [
          {
            "image": "https://cdn.lezhin.com/v2/inventory_items/6272864723140608/media/upperBanner",
            "link": "http://www.naver.com"
          },
          {
            "image": "https://cdn.lezhin.com/v2/inventory_items/4537033910124544/media/upperBanner",
            "link": "http://www.naver.com"
          },
          {
            "image": "https://cdn.lezhin.com/v2/inventory_items/5439666241929216/media/upperBanner",
            "link": "http://www.naver.com"
          },
          {
            "image": "https://cdn.lezhin.com/v2/inventory_items/6120926790549504/media/upperBanner",
            "link": "http://www.naver.com"
          }
        ];
      }
    },

    /**
     * fetch 실패시
     * @return {boolean} false
     * @private
     */
    _failHandler: function(){
      window.alert('Error Request.');
      return false;
    },

    /**
     * 전달 받은 파라미터를통해 만든 URL에서 쿼리 스트링 값 추출
     * @param  {string} name 추출하고 싶은 key
     * @param  {string} url  추출 대상 URL
     * @return {string}      추출 값
     * @private
     */
    _getParameterByName(name, url) {
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
  }

  window.Slider = window.Slider || {};
  window.Slider.Request = Request;
})(jQuery, window);
