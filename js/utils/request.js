(function($, window){
  function Request(){
    var me = this;

    return me;
  }

  Request.prototype = {
    fetch: function(options){
      var dfd = $.Deferred();

      return dfd.resolve(this._successHandler(options));
        // return $.ajax(options)
        //   .done($.proxy(this._successHandler, this))
        //   .fail(this._failHandler);
    },

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

    _failHandler: function(){
      window.alert('Error Request.');
      return false;
    },

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
