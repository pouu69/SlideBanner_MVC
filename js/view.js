(function($, window){
  function View(model, slideContainer){
    var self = this;

    self._model = model;

    self._template = new Slider.Template();
    self._observer = new Slider.Observer();

    if (!(self instanceof Slider.View)) {
        return new Slider.View();
    }

		return self;
  }

  View.prototype = {
    /* 초기화 메서드's */

    /**
     * View 요소 초기설정
     * @param  {object} slideContainer 슬라이더 컨테이너 요소객체
     * @public
     */
    init: function(slideContainer){
      this.$slideContainer = slideContainer;
      this.$slideWrap = this.$slideContainer.children().first();
      this.$slideItems = null;
      this.$navigator = null;
      this.$indicator = null;
    },

    /**
     * View 초기화
     * @private
     */
    _initView: function(){
      this.$slideWrap.html(this._template.makeView(this._model.items));

      this.$slideItems = this.$slideWrap.find('.slide-items');
      this.$navigator = $('.slide-navigator');
      this.$indicator = $('.slide-indicator li');

      if(this._model.device === 'mobile'){
        this.$navigator.addClass('hidden');
      }else{
        this.$navigator.removeClass('hidden');
      }

      this._responsiveSetItemWidth();
      this._setCurrentIndicator(this._model.indicatorIdx);

      if(this._model.isReRender){
        this._unBindEvts();
      }
      this._model.isReRender = true;
      this._bindEvts();

      if(this._model.options.autoSlide){
        this.dispatchEvent('onAutoSlide');
      }
    },

    /* custom event 등록 / 실행 */

    /**
     * Custom Event 등록
     * @param  {string}   event    이벤트명
     * @param  {Function} callback 호출할 콜백함수
     * @public
     */
    addEvent: function(event, callback){
      this._observer.subscribe(event, callback);
    },

    /**
     * 등록한 Custom Event 호출
     * @param  {stirng} event 이벤트명
     * @public
     */
    dispatchEvent: function(event, args){
      this._observer.notify(event, args);
    },

    /**
     * View에 바인딩할 이벤트 리스너 등록
     * @private
     */
    _bindEvts: function(){

      window.addEventListener('resize',this._handleResizeSetView.bind(this), false);
      window.addEventListener('orientationchange', this._handleResizeSetView.bind(this), false);

      if(this._model.isTouch()){
        var slideItems = document.getElementsByClassName('slide-items')[0].childNodes;
        for(var i = 0, len = slideItems.length ; i < len ; i += 1){
          this._bindItemTouchEvt(slideItems[i]);
        }
      }

      this.$slideItems.on('transitionend', this._handleTransitionEnd.bind(this));
      this.$navigator.on('click', this._handleClickNavigator.bind(this));
      this.$indicator.on('click', this._handleClickIndicator.bind(this));
    },

    /**
     * View에 바인딩할 이벤트 리스너 해제
     * @private
     */
    _unBindEvts: function(){
      window.removeEventListener('resize',this._handleResizeSetView.bind(this));
      window.removeEventListener('orientationchange',this._handleResizeSetView.bind(this));

      if(this._model.isTouch()){
        var slideItems = document.getElementsByClassName('slide-items')[0].childNodes;
        for(var i = 0, len = slideItems.length ; i < len ; i += 1){
          this._unBindItemTouchEvt(slideItems[i]);
        }
      }

      this.$slideItems.off('transitionend');
      this.$navigator.off('click');
      this.$indicator.off('click');
    },

    /**
     * 터치 이벤트 등록
     * @param  {object} $item 터치 이벤트 등록할 요소
     * @private
     */
    _bindItemTouchEvt: function($item){
      $item.addEventListener('touchstart', this._handleStartDrag.bind(this), false)
      $item.addEventListener('touchmove', this._handleMoveDrag.bind(this), false)
      $item.addEventListener('touchend', this._handleEndDrag.bind(this), false)
      $item.addEventListener('touchcancel', this._handleEndDrag.bind(this), false);
    },

    /**
     * 터치 이벤트 해제
     * @param  {object} $item 터치 이벤트 등록할 요소
     * @private
     */
    _unBindItemTouchEvt: function($item){
      $item.removeEventListener('touchstart', this._handleStartDrag.bind(this))
      $item.removeEventListener('touchmove', this._handleMoveDrag.bind(this))
      $item.removeEventListener('touchend', this._handleEndDrag.bind(this))
      $item.removeEventListener('touchcancel', this._handleEndDrag.bind(this));
    },

    /* event 콜백 메서드's */

    /**
     * 터치(드래그) 시작 이벤트 핸들러
     * @param  {object} e event객체
     * @private
     */
    _handleStartDrag: function(e){
      if(!this._model.isClkNav) return;
      this._model.isClkNav = false;
      this._model.startDrag(e.touches[0].clientX);
    },

    /**
     * 터치(드래그) 이동 이벤트 핸들러
     * @param  {object} e event 객체
     * @private
     */
    _handleMoveDrag: function(e){
      this._model.moveDrag(e.touches[0].clientX);
      stopPropagation(e);
    },

    /**
     * 터치(드래그) 종료 이벤트 핸들러
     * @param  {object} e event 객체
     * @private
     */
    _handleEndDrag: function(e){
      this._model.endDrag(e.changedTouches[0].clientX);
      stopPropagation(e);
      this._model.isClkNav = true;
    },

    /**
     * 네비게이션 클릭 이벤트 핸들러
     * @param  {object} e event 객체
     * @private
     */
    _handleClickNavigator: function(e){
      if(e) e.preventDefault();

      if(!this._model.isClkNav) return;
      this._model.isClkNav = false;

      var $target = $(e.target);

      if($target.attr('id') === 'prev'){
        this._model.movePrevItem();
      }else if($target.attr('id') === 'next'){
        this._model.moveNextItem();
      }
    },

    /**
     * 인디케이터 클릭 이벤트 핸들러
     * @param  {object} e event 객체
     * @private
     */
    _handleClickIndicator: function(e){
      if(e) e.preventDefault();

      var position = $(e.target).data().position;
      this._model.moveToIndex(position);
    },

    /**
     * resize 이벤트 핸들러
     * @param  {object} e event 객체
     * @private
     */
     _handleResizeSetView(e){
      if(e) e.preventDefault();
      var device = this.deviceCheck();
      if(device !== this._model.device){
        this.dispatchEvent('initView');
      }else{
        this._responsiveSetItemWidth();
      }
    },

    /**
     * transition 종료 이벤트 핸들러
     * @param  {object} e event 객체
     * @private
     */
    _handleTransitionEnd: function(){
      if(this._model.curIdx > this._model.itemsLen-1){
        this.$slideItems.css({
          'transition': 'none',
          'transform':'translate3d(0, 0, 0)'
        });
        this.dispatchEvent('setCurIdx', 0);
        this.dispatchEvent('onAutoSlide');
      }else if(this._model.curIdx < 0){
        this.$slideItems.css({
          'transition': 'none',
          'transform':'translate3d('+ ((-1) * this._model.itemWidth * (this._model.itemsLen-1)) + 'px, 0, 0)'
        });
        this.dispatchEvent('setCurIdx', this._model.itemsLen-1);
        this._model.isClkNav = true;
      }else{
        this.$slideItems.css({'transition' : 'none'});
        this.dispatchEvent('onAutoSlide');
      }
    },

    /**
     * resize 시 변경되는 윈도우 사이즈에 맞게 너비 조정
     * @private
     */
    _responsiveSetItemWidth: function(){
      var self = this;

      this._model.itemWidth = Math.floor(this.$slideWrap.outerWidth());

      this.$slideItems.css({
        'width': this._model.itemWidth * (this._model.itemsLen + 2),
        'left': ((-1) * this._model.itemWidth),
        '-webkit-transform-style' : 'preserve-3d',
        'transform-style' : 'preserve-3d',
        '-webkit-transform' : 'translate3d(' + ((-1) * this._model.itemWidth * this._model.curIdx) + 'px, 0, 0)',
        'transform' : 'translate3d(' + ((-1) * this._model.itemWidth * this._model.curIdx) + 'px, 0, 0)'
      });

      var $slideItemsLi = this.$slideItems.find('li');
      $slideItemsLi.css({width: this._model.itemWidth+'px'});
      setTimeout(function(){
        self.$slideWrap.css({height: $slideItemsLi.first().height()});
      },10);
    },

    /**
     * class를 통해 현재 인디케이터 설정
     * @param  {int} idx 현재 배너 인덱스
     * @private
     */
    _setCurrentIndicator: function(idx){
      this.$indicator.removeClass('current');
      $(this.$indicator[idx]).addClass('current');
    },

    /**
     * VIEW render 커맨드 집합
     * @param  {string} event 이벤트 명
     * @public
     */
    render: function(event){
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

    /**
     * 네비게이션 or 인디케티어 클릭 or 자동플레이일 경우 슬라이더 이동
     * @private
     */
    _move: function(){
      this.$slideItems.css({
        'transition' : 'all ' + this._model.options.speed + 'ms ease',
        '-webkit-transform-style' : 'preserve-3d',
        'transform-style' : 'preserve-3d',
        '-webkit-transform' : 'translate3d(' + ((-1) * this._model.moveDelta) + 'px, 0, 0)',
        'transform' : 'translate3d(' + ((-1) * this._model.moveDelta) + 'px, 0, 0)'
      });

      this._setCurrentIndicator(this._model.indicatorIdx);
    },

    /**
     * 터치(드래그) 일 경우 슬라이더 이동
     * @private
     */
    _moveDrag: function(){
      if(this._model.isDrag){
        var position = this.$slideItems.find('li').eq(this._model.curIdx).width();
        var delta = this._model.nextDragX - this._model.startDragX;

        this.$slideItems
          .css({
            'transition' : 'all ' + this._model.options.speed + 'ms ease',
            '-webkit-transform-style' : 'preserve-3d',
            'transform-style' : 'preserve-3d',
            '-webkit-transform' : 'translate3d(' +  (delta + (-1) * position * this._model.curIdx)+ 'px, 0, 0)',
            'transform' : 'translate3d(' +  (delta + (-1) * position * this._model.curIdx)+ 'px, 0, 0)'
          });
      };
    },

    /**
     * 터치(드래그) 종료일 경우 슬라이더 이동 종료
     * @private
     */
    _endDrag: function(){
      if (this._model.isDrag) {
          var delta = this._model.nextDragX - this._model.startDragX;
          if (Math.abs(delta) > this._model.itemWidth / 4) {
            if(delta < 0) this._model.moveNextItem();
            else          this._model.movePrevItem();
          }else{
            this._model.moveToIndex(this._model.curIdx);
          }
      }
    },

    /**
     * 현재 장치 체크
     * @return {string} 현재 장치값
     * @private
     */
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
