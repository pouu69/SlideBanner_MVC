(function($, window){
  'use strict';

  function Model(){
    var self = this;

    self._items = null;
    self._itemsLen = 0;
    self._curIdx = 0;
    self._curIndicatorIdx = 0;

    self.direction = 0;
    self.device = null;
    self.isReRender = false;
    self.itemWidth = 0;
    self.moveDelta = 0;
    self.startDragX = 0;
    self.nextDragX = 0;
    self.isDrag = false;
    self.isClkNav = true;
    self.options = {
      'autoSlide' : true,
      'infinity' : true,
      'speed' : 500
    },
    self.infinityLoopInterval = null;

    self._observer = new Slider.Observer();
    self._request = new Slider.Request();


    if (!(self instanceof Slider.Model)) {
        return new Slider.Model();
    }

		return self;
  }

  Model.prototype = {
    /* 초기화 메서드's */

    init: function(_options){
      for(var key in _options){
        if(_options.hasOwnProperty(key)){
          this.options[key] = _options[key];
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
        url: parameter.url + query
      };

      this._request.fetch(options)
                    .then(function(data){
                      self.setItems(data);
                      self.dispatchEvent('showView');
                    });
    },

    isTouch: function(){
			return 'ontouchstart' in document.documentElement || navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i) ? true : false ;
    },

    setItems: function(items){
      this._items = items;
      this._itemsLen = items.length;
    },

    getItems: function(){
      return this._items;
    },

    getItemsLen: function(){
      return this._itemsLen;
    },

    setCurIdx: function(idx){
      this._curIdx = idx;
    },

    getCurIdx: function(){
      return this._curIdx;
    },

    _setIndicatorIdx: function(idx){
      if(idx > this.getItemsLen() - 1 ){
        this._curIndicatorIdx = 0;
      }else if(idx < 0){
        this._curIndicatorIdx = this._itemsLen - 1;
      }else{
        this._curIndicatorIdx = idx;
      }
    },

    getIndicatorIdx: function(){
      return this._curIndicatorIdx;
    },

    /* custom 이벤트 관련 메서드's */

    moveToIndex: function(idx){
      if(idx < -1){
        idx = this._itemsLen - 2;
        this.moveDelta = this.itemWidth * (this._itemsLen - 2);
      }else if(idx > this._itemsLen){
        idx = 1;
        this.moveDelta = this.itemWidth;
      }else{
        this.moveDelta = this.itemWidth * idx;
      }

      this._curIdx = idx;
      this._setIndicatorIdx(this._curIdx);

      this.dispatchEvent('move');
    },

    moveNextItem: function(){
      this.moveDelta += this.itemWidth;
      this.moveToIndex(this._curIdx + 1);
    },

    movePrevItem: function(){
      this.moveDelta -= this.itemWidth;
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
