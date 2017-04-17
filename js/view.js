(function($, window){
  function View(model, slideContainer){
    this._model = model;

    this.$slideContainer = slideContainer;
    this.$slideWrap = this.$slideContainer.children().first();
    this.$slideItems = null;
    this.$navigator = null;
    this.$indicator = null;

    this._template = new Slider.Template();
    this._observer = new Slider.Observer();
  }

  View.prototype = {
    /* 초기화 메서드's */

    _initView: function(){
      this.$slideWrap.html(this._template.makeView(this._model.getItems()));

      this.$slideItems = this.$slideWrap.find('.slide-items');
      this.$navigator = $('.slide-navigator');
      this.$indicator = $('.slide-indicator li');

      if(this._model.getDevice() === 'mobile'){
        this.$navigator.addClass('hidden');
      }else{
        this.$navigator.removeClass('hidden');
      }

      this._responsiveSetItemWidth();
      this._setCurrentIndicator(this._model.getIndicatorIdx());

      this.$slideItems.find('li').eq(this._model.getCurIdx()).addClass('current');

      if(this._model.isReRender){
        this._unBindEvts();
      }
      this._model.isReRender = true;
      this._bindEvts();
    },

    /* custom event 등록 / 실행 */

    addEvent: function(event, callback){
      this._observer.subscribe(event, callback);
    },

    dispatchEvent: function(event){
      this._observer.notify(event);
    },

    /**
     * View에 바인딩할 이벤트 리스너 집합
     */
    _bindEvts: function(){
      this.$slideItems.on('click','a', function(e){
        console.log('node Name = ',e.target.nodeName);
        if(e.target.nodeName === 'a'){
          if(this._model.isDrag){
            console.log('anchor isDrag = ',this._model.isDrag);
            console.log(e);
          }
        }
      }.bind(this));
      window.addEventListener('resize', this._handleResizeSetView.bind(this), false);
      window.addEventListener('orientationchange', this._handleResizeSetView.bind(this), false);

      if(this._model.isTouch()){
        var slideItems = document.getElementsByClassName('slide-items')[0].childNodes;
        for(var i = 0, len = slideItems.length ; i < len ; i += 1){
          this._bindItemTouchEvt(slideItems[i]);
        }
      }

      this.$navigator.on('click', this._handleClickNavigator.bind(this));
      this.$indicator.on('click', this._handleClickIndicator.bind(this));
    },

    _unBindEvts: function(){
      window.removeEventListener('resize',this._handleResizeSetView.bind(this));
      window.removeEventListener('orientationchange',this._handleResizeSetView.bind(this));

      if(this._model.isTouch()){
        var slideItems = document.getElementsByClassName('slide-items')[0].childNodes;
        for(var i = 0, len = slideItems.length ; i < len ; i += 1){
          this._unBindItemTouchEvt(slideItems[i]);
        }
      }

      this.$navigator.off('click');
      this.$indicator.off('click');
    },

    _bindItemTouchEvt: function($item){
      $item.addEventListener('touchstart', this._handleStartDrag.bind(this), false)
      $item.addEventListener('touchmove', this._handleMoveDrag.bind(this), false)
      $item.addEventListener('touchend', this._handleEndDrag.bind(this), false)
      $item.addEventListener('touchcancel', this._handleEndDrag.bind(this), false);
    },

    _unBindItemTouchEvt: function($item){
      $item.removeEventListener('touchstart', this._handleStartDrag.bind(this))
      $item.removeEventListener('touchmove', this._handleMoveDrag.bind(this))
      $item.removeEventListener('touchend', this._handleEndDrag.bind(this))
      $item.removeEventListener('touchcancel', this._handleEndDrag.bind(this));
    },

    /* event 콜백 메서드's */

    _handleStartDrag: function(e){
      this._model.startDrag(e.touches[0].clientX);
    },

    _handleMoveDrag: function(e){
      this._model.moveDrag(e.touches[0].clientX);
      stopPropagation(e);
    },

    _handleEndDrag: function(e){
      this._model.endDrag(e.changedTouches[0].clientX);
      stopPropagation(e);
    },

    _handleClickNavigator: function(e){
      if(e) e.preventDefault();

      var $target = $(e.target);

      if($target.attr('id') === 'prev'){
        this._model.movePrevItem();
      }else if($target.attr('id') === 'next'){
        this._model.moveNextItem();
      }
    },

    _handleClickIndicator: function(e){
      if(e) e.preventDefault();

      var position = $(e.target).data().position;
      this._model.moveToIndex(position);
    },

    _handleResizeSetView(e){
      if(e) e.preventDefault();
      var device = this.deviceCheck();
      if(device !== this._model.getDevice()){
        this.dispatchEvent('initView');
      }else{
        this._responsiveSetItemWidth();
      }
    },

    _handleTransitionEnd: function(){
      this.$slideItems.css({'transition' : 'none'});

      // var $itemLi = this.$slideItems.find('li');
      // $itemLi.eq(this._model.getItemsLen()-1).after($itemLi.eq(0));
    },

    _responsiveSetItemWidth: function(){
      this._model.itemWidth = Math.floor(this.$slideWrap.outerWidth());

      this.$slideItems.width(this._model.itemWidth * this._model.getItemsLen());
      this.$slideItems.css({
        '-webkit-transform-style' : 'preserve-3d',
        'transform-style' : 'preserve-3d',
        '-webkit-transform' : 'translate3d(' + ((-1) * this._model.itemWidth * this._model.getCurIdx()) + 'px, 0, 0)',
        'transform' : 'translate3d(' + ((-1) * this._model.itemWidth * this._model.getCurIdx()) + 'px, 0, 0)'
      });
      this.$slideItems.find('li').css({width: this._model.itemWidth+'px'});
    },

    _setCurrentIndicator: function(idx){
      this.$indicator.removeClass('current');
      $(this.$indicator[idx]).addClass('current');
    },

    /**
     * VIEW render 이벤트 집합
     * @param  {string} event                   이벤트 명
     * @param  {array|object|string} parameters 넘길 파라미터
     */
    render: function(event, parameters){
      var self = this;
      var Commands = {
        'move': function(){
          self._move();
        },
        'moveDrag': function(){
          self._moveDrag();
        },
        'endDrag': function(){
          self._endDrag();
        },
        'showView': function(){
          self._initView();
        }
      }

      Commands[event]();
    },

    /* render 콜백 메서드's */

    _move: function(){
      var position = this.$slideItems.find('li').eq(this._model.getCurIdx()).width();
      this.$slideItems.find('li').eq(this._model.getCurIdx()).addClass('current');

      this.$slideItems.css({
        'transition' : 'all 400ms ease',
        '-webkit-transform-style' : 'preserve-3d',
        'transform-style' : 'preserve-3d',
        '-webkit-transform' : 'translate3d(' + ((-1) * this._model.itemWidth * this._model.getCurIdx()) + 'px, 0, 0)',
        'transform' : 'translate3d(' + ((-1) * this._model.itemWidth * this._model.getCurIdx()) + 'px, 0, 0)'
      });

      this._setCurrentIndicator(this._model.getIndicatorIdx());
    },

    _moveDrag: function(){
      if(this._model.isDrag){
        var position = this.$slideItems.find('li').eq(this._model.getCurIdx()).width();
        var delta = this._model.nextDragX - this._model.startDragX;

        this.$slideItems
          .css({
            'transition' : 'all 100ms ease',
            '-webkit-transform-style' : 'preserve-3d',
            'transform-style' : 'preserve-3d',
            '-webkit-transform' : 'translate3d(' +  (delta + (-1) * position * this._model.getCurIdx())+ 'px, 0, 0)',
            'transform' : 'translate3d(' +  (delta + (-1) * position * this._model.getCurIdx())+ 'px, 0, 0)'
          });
      };
    },

    _endDrag: function(){
      if (this._model.isDrag) {
          var delta = this._model.nextDragX - this._model.startDragX;
          if (Math.abs(delta) > this._model.itemWidth / 4) {
            if(delta < 0) this._model.moveNextItem();
            else          this._model.movePrevItem();
          }else{
            this._model.moveToIndex(this._model.getCurIdx());
          }
      }
    },

    deviceCheck(){
      var curWindowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      if(screen.width < 768 || curWindowWidth < 768){
        return 'mobile';
      }
      return 'desktop';
    }
  }

  window.Slider = window.Slider || {};
  window.Slider.View = View;
})(jQuery, window);
