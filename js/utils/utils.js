(function(window){
  'use strict';

  Object.size = function(obj){
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  }

  function stopPropagation(e){
    if (e.cancelBubble) e.cancelBubble = true;
    else if (e.stopPropagation) e.stopPropagation();
  }

  window.stopPropagation = stopPropagation;
})(window);
