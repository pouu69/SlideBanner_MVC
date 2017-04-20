(function(Slider){
  function Controller(view, model){
    var self = this;

    self._view = view;
    self._model = model;

    self._bindViewEvts();
    self._bindModelEvts();

    if (!(self instanceof Slider.Controller)) {
        return new Slider.Controller();
    }

		return self;
  }

  Controller.prototype = {
    /**
     * Slide 초기 설정
     * @param  {object} slideContainer 슬라이더 컨테이너 요소객체
     * @param  {object} options        사용자가 전달하는 옵션값
     * @public
     */
    initSlide: function(slideContainer, options){
      this._model.device = this._view.deviceCheck();
      this._model.init(options);
      this._view.init(slideContainer);
    },

    /**
     * View 초기화
     * @private
     */
    _initView: function(){
      var self = this;
      this._model.device = this._view.deviceCheck();
      this._model.fetchData(this._model.options)
                  .then(function(data){
                    // self.setItems(data);
                    self._model.items = data;
                    self._showView();
                  });
    },

    /**
     * 슬라이드 자동 플레이기능 실행
     * @private
     */
    _handleAutoSlideLoop: function(){
      if(this._model.options.autoSlide){
        clearTimeout(this._model.autoSlideInterval);
        this._model.autoSlideInterval = null;
        if(this._model.options.autoSlide){
          this._model.isClkNav = true;
          this._model.autoSlideInterval = setTimeout(this._model.moveNextItem.bind(this._model),0);
        }
      }else{
        this._model.isClkNav = true;
      }
    },

    /**
     * View custom 이벤트 등록
     * @private
     */
    _bindViewEvts: function(){
      this._view.addEvent('initView', this._initView.bind(this));
      this._view.addEvent('setCurIdx', this._setCurIdx.bind(this));
      this._view.addEvent('onAutoSlide', this._handleAutoSlideLoop.bind(this));
    },

    /**
     * Model custom 이벤트 등록
     * @private
     */
    _bindModelEvts: function(){
      this._model.addEvent('showView', this._showView.bind(this));
      this._model.addEvent('move', this._move.bind(this));
      this._model.addEvent('moveDrag', this._moveDrag.bind(this));
      this._model.addEvent('endDrag', this._endDrag.bind(this));
    },

    /**
     * 슬라이드 View 화면에 그리기
     * @private
     */
    _showView: function(){
      this._view.render('showView');
    },

    /**
     * 슬라이드 이동
     * @private
     */
    _move: function(){
      this._view.render('move');
    },

    /**
     * 터치 드래그 이동
     * @private
     */
    _moveDrag: function(){
      this._view.render('moveDrag');
    },

    /**
     * 터치(드래그) 종료
     * @private
     */
    _endDrag: function(){
      this._view.render('endDrag');
    },

    /**
     * 현재 베너 인덱스 설정
     * @param  {object}       e    event객체
     * @param  {stirng|array} args 전달할 파라미터
     * @private
     */
    _setCurIdx: function(e, args){
      this._model.curIdx = args;
    }
  }

  Slider.Controller = Controller;
})(Slider || {});
