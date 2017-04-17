(function($, window){
  'use strict';

  function Model(items, options){
    this._items = this.items;
    this._itemsLen = 0;
    this._curIdx = 0;
    this._curIndicatorIdx = 0;
    this._device = null;

    this.isReRender = false;
    this.options = options;
    this.itemWidth = 0;
    this.startDragX = 0;
    this.nextDragX = 0;
    this.isDrag = false;

    this._defaultOptions = {
      "autoSlide" : true,
      "infinity" : false
    }

    this._observer = new Slider.Observer();
    this._request = new Slider.Request();

    this._init.call(this);
  }

  Model.prototype = {
    /* 초기화 메서드's */

    _init: function(){
      this._initOption();
    },

    _initOption: function(){
      for(var key in this.options){
        if(this.options.hasOwnProperty(key) && this._defaultOptions.hasOwnProperty(key)){
          this._defaultOptions[key] = this.options[key];
        }
      }
    },

    /* custom event 등록 / 실행 */

    addEvent: function(event, callback){
      this._observer.subscribe(event, callback);
    },

    dispatchEvent: function(event){
      this._observer.notify(event);
    },

    /* Model Data 세팅 메서드's */

    fetchData: function(parameter){
      var self = this;
      var query = '?device=' + parameter.device + '&count=' + parameter.count;
      var options = {
        url: './static/dummy.json' + query ,
        type: 'get'
      };

      this._request.fetch(options)
                    .then(function(data){
                      self.setItems(data);
                    });
    },

    isTouch: function(){
			return 'ontouchstart' in document.documentElement || navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i) ? true : false ;
    },

    setItems: function(items){
      this._items = items;
      this._itemsLen = items.length;

      this.dispatchEvent('showView');
    },

    getItems: function(){
      return this._items;
    },

    getItemsLen: function(){
      return this._itemsLen;
    },

    getCurIdx: function(){
      return this._curIdx;
    },

    _setIndicatorIdx: function(idx){
      this._curIndicatorIdx = idx;
    },

    getIndicatorIdx: function(){
      return this._curIndicatorIdx;
    },

    setDevice: function(device){
      this._device = device;
    },

    getDevice: function(){
      return this._device;
    },

    /* custom 이벤트 관련 메서드's */

    moveToIndex: function(idx){
      if(idx < 0){
        idx = this._itemsLen - 1;
      }else if(idx > (this._itemsLen - 1)){
        idx = 0;
      }

      this._curIdx = idx;
      this._setIndicatorIdx(this._curIdx);

      this.dispatchEvent('move');
    },

    moveNextItem: function(){
      this.moveToIndex(this._curIdx + 1);
    },

    movePrevItem: function(){
      this.moveToIndex(this._curIdx - 1);
    },

    startDrag: function(posX){
      this.isDrag = true;
      this.startDragX = posX;
    },

    moveDrag: function(nextPosX){
      if(this.isDrag){
        if(nextPosX !== this.nextDragX){
          this.nextDragX = nextPosX;
          this.dispatchEvent('moveDrag');
        }
      }
    },

    endDrag: function(endDragX){
      if(this.isDrag && this.nextDragX !== 0){
        this.dispatchEvent('endDrag');
      }
      this.isDrag = false;
      this.startDragX = 0;
      this.nextDragX = 0;
    }
  }

  window.Slider = window.Slider || {};
  window.Slider.Model = Model;
})(jQuery,window);
