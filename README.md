# Lezin Web개발자 과제
- 지원자: 박관웅
- 지원분야: Web개발자/백오피스
- 이메일: pouu69@naver.com

## SliderBanner MVC
### 프로젝트 구조
- src
  - css
    - index.css : 기본 CSS 파일
  - js
    - utils
      - request.js(외부 API 요청관련 메서드 정의)
      - template.js(html 템플릿 생성)
      - utils.js(단순 유틸리티 함수)
    - SliderController.js(컨트롤러 클래스)
    - SliderModel.js(모델 클래스)
    - SliderObserver.js(옵저버 클래스)
    - SliderView.js(뷰 클래스)
  - lib
    - jasmine
      - jasmine 관련 파일들(.js, .css)
    - should.min.js
  - namespace.js(MVC클래스 네임 정의한 네임스페이스)
  - SliderMVC.js(실제 슬라이더 실행 하기 위한 생성자)
- test
  - SliderModelRunner.html(모델 레이어 테스트 하는 브라우저)
  - SliderModelSpec.js(모델 레이어 테스트 코드)
- db.json(배너 데이터 Mock 데이터)
- index.html( 실행 할 html )
- server.js(fake 서버)

### 실행

- fake 서버 실행
  ````
  npm run server
  ````
- 슬라이더(index.html) 실행
  ````
  npm run open
  ````

### 테스트

- Model layer 만 테스트 진행
  ````
  npm run test
  ````

### 옵션

- count : 가져올 데이터 갯수(최대 4)
- autoSlide : 자동 플레이 실행 유무(default: false)
- infinity : 무한 순환 유무(default: true)
- speed : 슬라이드 넘어가는 속도(default: 500ms)

````javascript
$(document).ready(function(){
  var sliderMVC = new SliderMVC();
	sliderMVC.initSlide($('.slide-container'),{
		count: 4,
    autoSlide: false,
		speed: 1200,
    infinity: false
	});
});
````
