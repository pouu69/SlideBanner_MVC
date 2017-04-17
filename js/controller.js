(function($, window){
  function Controller(view, model){
    this._view = view;
    this._model = model;

    this._bindViewEvts();
    this._bindModelEvts();
  }

  Controller.prototype = {
    initSlide: function(options){
      this.initView(options);
    },

    initView: function(options){
      var curDevice = this._view.deviceCheck();
      this._model.setDevice(curDevice);
      options.device = curDevice;

      this._model.fetchData(options);
    },

    /**
     * View custom 이벤트 등록
     */
    _bindViewEvts: function(){
      this._view.addEvent('initView', this.initView.bind(this));
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
    },

    _moveDrag: function(){
      this._view.render('moveDrag');
    },

    _endDrag: function(){
      this._view.render('endDrag');
    }
  }

  window.Slider = window.Slider || {};
  window.Slider.Controller = Controller;
})(jQuery, window);
