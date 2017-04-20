(function($, Slider){

  function Template(){
    var self = this;

    self.defaultUlTpl = '<ul class="{{class}}">{{items}}</ul>';
    self.defaultItemTpl
      = '<li data-key={{key}}>'
      +   '<a target="_blank" href="{{link}}">'
      +     '<img src="{{image}}" />'
      +   '</a>'
      + '</li>';

    self.defaultNavigationTpl
      = '<div class="slide-navigator">'
      +   '<span id="prev">&laquo;</span>'
      +   '<span id="next">&raquo;</span>'
      + '</div>';
    self.defaultIndicatorItemTpl = '<li data-position="{{position}}"></li>';

    if (!(self instanceof Slider.Template)) {
        return new Slider.Template();
    }

		return self;
  }

  Template.prototype = {
    /**
     * 화면에 보여질 슬라이더 View 최종 템플릿 생성
     * @param  {array} items 배너 데이터
     * @return {string}      템플릿 스트링
     * @public
     */
    makeView: function(items){
      return this.makeItemsTpl(items) + this.makeIndicatorItemTpl(items) + this.makeNavigationTpl();
    },

    /**
     * 슬라이더 View에서 배너 슬라이더 템플릿 생성
     * @param  {array} items 배너 데이터
     * @return {string}      슬라이더 템플릿
     * @public
     */
    makeItemsTpl: function(items){
      var resultTpl = '';
      for(var i = 0, len = items.length ; i < len ; i += 1 ){
        resultTpl = resultTpl + this.makeItemTpl(i, items[i]);
      }
      resultTpl = this.makeItemTpl(-1, items[items.length-1]) + resultTpl + this.makeItemTpl(items.length, items[0]);
      return this.defaultUlTpl.replace('{{items}}', resultTpl)
                              .replace('{{class}}', 'slide-items');
    },

    /**
     * 슬라이더 배너 요소 한개의 템플릿
     * @param  {string} key  배너 인덱스
     * @param  {object} item 배너 한개 데이터
     * @return {string}      배너 한개의 템플릿
     * @public
     */
    makeItemTpl: function(key, item){
      var tpl = this.defaultItemTpl;
      tpl = tpl.replace('{{key}}', key);
      tpl = tpl.replace('{{link}}', item.link);
      tpl = tpl.replace('{{image}}', item.image);

      return tpl;
    },

    /**
     * 인디케이터 템플릿
     * @param  {array} items  배너데이터
     * @return {string}       인디케이터 템플릿
     * @public
     */
    makeIndicatorItemTpl: function(items){
      var resultTpl = '';

      for(var i = 0, len = items.length ; i < len ; i += 1){
          resultTpl = resultTpl + this.defaultIndicatorItemTpl.replace('{{position}}', i);
      }
      return this.defaultUlTpl.replace('{{items}}',resultTpl)
                              .replace('{{class}}', 'slide-indicator');
    },

    /**
     * 네비게이션 템플릿
     * @return {string} 네비게이션 템플릿
     * @public
     */
    makeNavigationTpl: function(){
      return this.defaultNavigationTpl;
    }
  }

  // window.Slider = window.Slider || {};
  Slider.Template = Template;
})(jQuery, Slider || {});
