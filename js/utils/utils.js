(function(window){
  'use strict';

  /**
   * object size 반환
   * @param  {object} obj 객체 데이터
   * @return {int}     객체 데이터 사이즈
   */
  Object.size = function(obj){
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  }

  /**
   * 부모 이벤트 전파 차단
   * @param  {object} e event객체
   */
  function stopPropagation(e){
    if (e.cancelBubble) e.cancelBubble = true;
    else if (e.stopPropagation) e.stopPropagation();
  }

  window.stopPropagation = stopPropagation;
})(window);
