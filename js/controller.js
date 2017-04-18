(function($, window){
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
    initSlide: function(slideContainer, options){
      this._model.init(options);
      this._view.init(slideContainer);
      this.initView(options);
    },

    initView: function(){
      var curDevice = this._view.deviceCheck();
      this._model.device = curDevice;
      this._model.options.device = curDevice;

      this._model.fetchData(this._model.options);
    },

    /**
     * View custom 이벤트 등록
     */
    _bindViewEvts: function(){
      this._view.addEvent('initView', this.initView.bind(this));
      this._view.addEvent('setCurIdx', this._setCurIdx.bind(this));
    },

    /**
     * Model custom 이벤트 등록
     */
    _bindModelEvts: function(){
      this._model.addEvent('showView', this._showView.bind(this));
      this._model.addEvent('move', this._move.bind(this));
      this._model.addEvent('moveDrag', this._moveDrag.bind(this));
      this._model.addEvent('endDrag', this._endDrag.bind(this));
    },

    _move: function(){
      this._view.render('move');
    },

    _showView: function(){
      this._view.render('showView');
      
      clearInterval(this._model.infinityLoopInterval);
      this._model.infinityLoopInterval = null;
      if(this._model.options.infinity){
        this._model.infinityLoopInterval = setInterval(this._model.moveNextItem.bind(this._model), this._model.options.speed);
      }
    },

    _moveDrag: function(){
      this._view.render('moveDrag');
    },

    _endDrag: function(){
      this._view.render('endDrag');
    },

    _setCurIdx: function(e, args){
      this._model.setCurIdx(args);
    }
  }

  window.Slider = window.Slider || {};
  window.Slider.Controller = Controller;
})(jQuery, window);
