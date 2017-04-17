(function($, window){

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
    makeView: function(items){
      return this.makeItemsTpl(items) + this.makeIndicatorItemTpl(items) + this.makeNavigationTpl();
    },

    makeItemsTpl: function(items){
      var resultTpl = '';
      for(var i = 0, len = items.length ; i < len ; i += 1 ){
        var tpl = this.defaultItemTpl;
        tpl = tpl.replace('{{key}}', i);
        tpl = tpl.replace('{{link}}', items[i].link);
        tpl = tpl.replace('{{image}}', items[i].image);

        resultTpl = resultTpl + tpl;
      }
      return this.defaultUlTpl.replace('{{items}}', resultTpl)
                              .replace('{{class}}', 'slide-items');
    },

    makeIndicatorItemTpl: function(items){
      var resultTpl = '';

      for(var i = 0, len = items.length ; i < len ; i += 1){
          resultTpl = resultTpl + this.defaultIndicatorItemTpl.replace('{{position}}', i);
      }
      return this.defaultUlTpl.replace('{{items}}',resultTpl)
                              .replace('{{class}}', 'slide-indicator');
    },

    makeNavigationTpl: function(){
      return this.defaultNavigationTpl;
    }
  }

  window.Slider = window.Slider || {};
  window.Slider.Template = Template;
})(jQuery, window);
