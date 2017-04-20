// var SliderModel = require('../js/SliderModel.js');
describe('Slider Model Test', function(){
  var sliderModel = new Slider.Model();
  var jObjContain = jasmine.objectContaining;

  describe('1. Model 초기 데이터 설정', function(){
    it('1) 장치(디바이스) 값 설정한다. ', function(){
      var deviceName = 'desktop';
      sliderModel.device = deviceName;

      expect(sliderModel.device).toEqual(deviceName);
    });

    it('2) 사용자가 전달한 옵션을 default로 설정된 옵션과 merge하여 설정한다.', function(){
      var userOptions = {
  			url: 'url',
  			count: 4,
        autoSlide: false,
  			speed: 1200
  		};

      sliderModel._optionsMerge(userOptions);
      expect(sliderModel.options).toEqual(jObjContain(userOptions));
    });

    it('3) 배너 데이터 설정한다.', function(done){
        sliderModel.fetchData(sliderModel.options)
          .then(function(data){
            sliderModel.items = data;
            console.log(data);
            expect(sliderModel.items).not.toEqual(null);
            expect(sliderModel.itemsLen).toEqual(data.length);
            done();
          });
    });

    it('4) 배너요소 크기 설정한다.', function(){
      var itemWidth = '1000';
      sliderModel.itemWidth = itemWidth;
      expect(sliderModel.itemWidth).toEqual(itemWidth);
    });
  });

  describe('2. 배너 이동', function(){
    it('1) 왼쪽(이전)으로 이동시 인덱스 -1 감소 하며 indicator 인덱스도 동일하게 변화한다.', function(){
      for(var i = sliderModel.itemsLen-1 ; i >= 0 ; i -= 1){
        var curIdx = i;
        sliderModel.curIdx = curIdx;
        sliderModel.movePrevItem();

        if(sliderModel.curIdx > sliderModel.itemsLen-1){
          sliderModel.curIdx = 0;
        }else if(sliderModel.curIdx < 0){
          sliderModel.curIdx = sliderModel.itemsLen-1;
        }

        if(i !== 0){
          expect(sliderModel.curIdx).toEqual(i-1);
          expect(sliderModel.indicatorIdx).toEqual(i-1);
        }else if( i === 0){
          expect(sliderModel.curIdx).toEqual(sliderModel.itemsLen-1);
          expect(sliderModel.indicatorIdx).toEqual(sliderModel.itemsLen-1);
        }
      }
    });

    it('2) 오른쪽(다음)으로 이동시 인덱스 +1 증가 하고, indicator 인덱스도 동일하게 변화한다.', function(){
      for(var i = 0 ; i <= sliderModel.itemsLen - 1  ; i += 1){
        var curIdx = i;
        sliderModel.curIdx = curIdx;
        sliderModel.moveNextItem();

        if(sliderModel.curIdx > sliderModel.itemsLen-1){
          sliderModel.curIdx = 0;
        }else if(sliderModel.curIdx < 0){
          sliderModel.curIdx = sliderModel.itemsLen-1;
        }

        if(i === sliderModel.itemsLen - 1){
          expect(sliderModel.curIdx).toEqual(0);
          expect(sliderModel.indicatorIdx).toEqual(0);
        }else{
          expect(sliderModel.curIdx).toEqual(i+1);
          expect(sliderModel.indicatorIdx).toEqual(i+1);
        }
      }
    });

    it('3) 배너가 실제로 이동해야할 delat(px) 값 확인한다.', function(){
      var curIdx = 0;
      var resultMoveDelta = sliderModel.itemWidth * (curIdx+1);

      sliderModel.curIdx = curIdx;
      sliderModel.moveDelta = 0;
      sliderModel.moveNextItem();
      expect(sliderModel.moveDelta).toEqual(resultMoveDelta);
    });
  });
});
