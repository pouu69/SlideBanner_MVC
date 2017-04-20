(function(Slider, module){
  'use strict';

  function Model(){
    var self = this;

    self._items = null;
    self._itemsLen = 0;
    self._curIdx = 0;
    self._curIndicatorIdx = 0;
    self._device = null;
    self._isReRender = false;
    self._itemWidth = 0;
    self._moveDelta = 0;
    self._startDragX = 0;
    self._nextDragX = 0;
    self._isDrag = false;
    self._isClkNav = true;
    self._autoSlideInterval = null;

    self.options = {
      'infinity': true,
      'autoSlide' : true,
      'speed' : 500
    },

    self._observer = new Slider.Observer();
    self._request = new Slider.Request();

    if (!(self instanceof Slider.Model)) {
        return new Slider.Model();
    }

		return self;
  }

  Model.prototype = {
    /* 초기화 메서드's */

    /**
     * Model 옵션 파라미터 값 초기화
     * @param  {object} _options 사용자가 넘긴 옵션값들
     * @public
     */
    init: function(_options){
      var self = this;
      this._optionsMerge(_options);
      this.fetchData(this.options)
          .then(function(data){
            // self.setItems(data);
            self.items = data;
            self.dispatchEvent('showView');
          });
    },

    /**
     * default옵션과 사용자가 전달한 option을 merge
     * @param  {object} _options 사용자가 넘긴 옵션값들
     * @private
     */
    _optionsMerge: function(_options){
      for(var key in _options){
        if(_options.hasOwnProperty(key)){
          this.options[key] = _options[key];
        }
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
    dispatchEvent: function(event){
      this._observer.notify(event);
    },

    /* Model Data 세팅 메서드's */

    /**
     * 배너 데이터 fetch
     * @param  {object} parameter 옵션 파라미터
     * @public
     */
    fetchData: function(parameter){
      var options = {
        url: "http://localhost:3000/" + this.device + "?_limit=" + parameter.count,
        type: "get"
      };

      return this._request.fetch(options);
    },

    /**
     * touch 이벤트가 가능한 상태인지 체크
     * @return {boolean} 터치 가능 유무
     * @public
     */
    isTouch: function(){
			return 'ontouchstart' in document.documentElement || navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i) ? true : false;
    },

    /* custom 이벤트 관련 메서드's */

    /**
     * 무한 순회 일 경우 인덱스와 이동delta값 설정
     * @param  {string} idx 다음 인덱스
     * @return {string}     다음 인덱스 설정된 값
     * @private
     */
    _infinityMove: function(idx){
      if(idx < -1){
        idx = this._itemsLen - 2;
        this.moveDelta = this.itemWidth * (this._itemsLen - 2);
      }else if(idx > this._itemsLen){
        idx = 1;
        this.moveDelta = this.itemWidth;
      }else{
        this.moveDelta = this.itemWidth * idx;
      }

      return idx;
    },

    /**
     * 무한 루프가 아닌 상황에서 인덱스와 이동delta 값 설정
     * @param  {string} idx 다음 인덱스
     * @return {string}     다음 인덱스 설정된 값
     * @private
     */
    _notInfinityMove: function(idx){
      if(idx > this.itemsLen-1){
        this.moveDelta -= this.itemWidth;
        idx = this.itemsLen - 1;
      }else if(idx < 0){
        this.moveDelta = 0;
        idx = 0;
      }else{
        this.moveDelta = this.itemWidth * idx;
      }
      this.isClkNav = true;

      return idx;
    },

    /**
     * 인덱스 위치로 배너 이동
     * @param  {int} idx 배너가 이동할 인덱스
     * @public
     */
    moveToIndex: function(idx){
      if(this.options.infinity) {
        idx = this._infinityMove(idx);
      } else {
        idx = this._notInfinityMove(idx);
      }

      this.curIdx = idx;
      this._indicatorIdx = this.curIdx;

      this.dispatchEvent('move');
    },

    /**
     * Next 네비게이터 클릭
     * @public
     */
    moveNextItem: function(){
      this.moveDelta += this.itemWidth;
      this.moveToIndex(this.curIdx + 1);
    },

    /**
     * Previous 네비게이터 클릭
     * @public
     */
    movePrevItem: function(){
      this.moveDelta -= this.itemWidth;
      this.moveToIndex(this.curIdx - 1);
    },

    /**
     * 드래그(터치) 시작
     * @param  {int} posX 터치를 시작한 X좌표
     * @public
     */
    startDrag: function(posX){
      this.isDrag = true;
      this.startDragX = posX;
    },

    /**
     * 터치 한 손가락 이동시
     * @param  {int} nextPosX 이동된 x좌표
     * @public
     */
    moveDrag: function(nextPosX){
      if(this.isDrag){
        if(nextPosX !== this.nextDragX){
          this.nextDragX = nextPosX;
          this.dispatchEvent('moveDrag');
        }
      }
    },

    /**
     * 터치 를 떼는 순간(완료시)
     * @param  {int} endDragX 터치 뗸 순간의 X좌표
     * @public
     */
    endDrag: function(endDragX){
      if(this.isDrag && this.nextDragX !== 0){
        this.isClkNav = true;
        this.dispatchEvent('endDrag');
      }
      this.isDrag = false;
      this.startDragX = 0;
      this.nextDragX = 0;
    },

    /**
     * 배너 데이터's 초기화
     * @param  {array} items 배너 데이터
     * @public
     */
    set items(items){
      this._items = items;
      this.itemsLen = items.length;
    },

    /**
     * 배너 데이터's 반환
     * @return {array} 배너 데이터's 반환
     * @public
     */
    get items(){
      return this._items;
    },

    /**
     * 배너 데이터 사이즈 지정
     * @param  {int} len 배너 데이터 길이
     * @public
     */
    set itemsLen(len){
      this._itemsLen = len;
    },

    /**
     * 배너 데이터 사이즈 반환
     * @return {int} 배너 데이터 길이
     */
    get itemsLen(){
      return this._itemsLen;
    },

    /**
     * 현재 배너 위치 인덱스 설정
     * @param  {int} idx 현재 인덱스
     * @public
     */
    set curIdx(idx){
      this._curIdx = idx;
    },

    /**
     * 현재 배너 위치 반환
     * @return {int} 현재 배너 위치
     * @public
     */
    get curIdx(){
      return this._curIdx;
    },

    /**
     * 변경될 인디케이터 위치(인덱스) 설정
     * @param  {int} idx 변경될 인디케이터 인덱스
     * @private
     */
    set _indicatorIdx(idx){
      if(idx > this.itemsLen - 1 ){
        this._curIndicatorIdx = 0;
      }else if(idx < 0){
        this._curIndicatorIdx = this._itemsLen - 1;
      }else{
        this._curIndicatorIdx = idx;
      }
    },

    /**
     * 현재 인디케이터 위치 반환
     * @return {int} 현재 인디케이터 인덱스
     * @public
     */
    get indicatorIdx(){
      return this._curIndicatorIdx;
    },

    /**
     * 현재 장치(디바이스) 설정
     * @param  {string} device 장치(디바이스)명 ('mobile', 'desktop')
     * @public
     */
    set device(device){
      this._device = device;
    },

    /**
     * 현재 장치(디바이스) 반환
     * @return {string} 장치(디바이스)명 ('mobile', 'desktop')
     */
    get device(){
      return this._device;
    },

    /**
     * 최초 실행(view render) 이후 re render 하는 상황을 체크하기 위해 설정
     * @param  {Boolean} isReRender re render 체크값
     * @public
     */
    set isReRender(isReRender){
      this._isReRender = isReRender;
    },

    /**
     * re render 상황인지 체크값 반환
     * @return {Boolean} re render 체크값
     * @public
     */
    get isReRender(){
      return this._isReRender;
    },

    /**
     * 배너 한개의 너비 설정
     * @param  {string} w 배너 너비
     * @public
     */
    set itemWidth(w){
      this._itemWidth = w;
    },

    /**
     * 배너 한개 너비 값 반환
     * @return {string} 배너 너비
     * @public
     */
    get itemWidth(){
      return this._itemWidth;
    },

    /**
     * 슬라이드가 움직여야할 너비값 설정
     * @param  {string} delta 움직일 너비값
     * @public
     */
    set moveDelta(delta){
      this._moveDelta = delta;
    },

    /**
     * 슬라이드가 움직여야할 너비값 반환
     * @return {string} 너비값
     * @public
     */
    get moveDelta(){
      return this._moveDelta;
    },

    /**
     * 터치 시작 시 X좌표 설정
     * @param  {string} posX 터치 시작시 X좌표
     * @public
     */
    set startDragX(posX){
      this._startDragX = posX;
    },

    /**
     * 터치 시작시 X좌표 반환
     * @return {string} 터치 시작시 X좌표
     * @public
     */
    get startDragX(){
      return this._startDragX;
    },

    /**
     * 터치(드래그) X좌표값 설정
     * @param  {string} posX 이동 X좌표값
     * @public
     */
    set nextDragX(posX){
      this._nextDragX = posX;
    },

    /**
     * 터치(드래그) X좌표값 반환
     * @return {string} posX 이동 X좌표값
     */
    get nextDragX(){
      return this._nextDragX;
    },

    /**
     * 터치(드래그)가 가능한 상태인지 설정
     * @param  {Boolean} _isDrag 드래그 가능 상태값
     * @public
     */
    set isDrag(_isDrag){
      this._isDrag = _isDrag;
    },

    /**
     * 터치(드래그)가 가능한지 상태값 반환
     * @return {Boolean} 드래그 가능 상태값
     * @public
     */
    get isDrag(){
      return this._isDrag;
    },

    /**
     * 네비게이션 클릭 가능 한지 상태값 설정
     * @param  {Boolean} _isClkNav 네비게이션 클릭 가능 상태값
     * @public
     */
    set isClkNav(_isClkNav){
      this._isClkNav = _isClkNav;
    },

    /**
     * 네비게이션 클릭 가능 한지 상태값 반환
     * @return {Boolean} 네비게이션 클릭 가능 상태값
     * @public
     */
    get isClkNav(){
      return this._isClkNav;
    },

    /**
     * 자동 플레이 기능 실행하는 Timeout 함수 설정
     * @param  {Functon} _autoSlideInterval setTimeout 객체
     * @public
     */
    set autoSlideInterval(_autoSlideInterval){
      this._autoSlideInterval = _autoSlideInterval;
    },

    /**
     * 자동 플레이 기능 실행하는 Timeout 함수 반환
     * @return {Functon} setTimeout 객체
     * @public
     */
    get autoSlideInterval(){
      return this._autoSlideInterval;
    }
  }

  Slider.Model = Model;
})(Slider || {});
