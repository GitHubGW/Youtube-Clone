// main.js에 styles.scss파일을 import해준 이유는 웹팩은 하나의 entry(시작점)포인트가 있고
// 그 시작점 파일에서 많은 파일들을 내보내는 형태의 구조로 되어있기 때문이다.
import "../scss/styles.scss";
import "./videoPlayer";
