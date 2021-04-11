// videoContainer-> videoPlayer
// videoPlayer-> video 로 변경함
const videoPlayer = document.getElementById("jsVideoPlayer");
const video = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");
const volumeBtn = document.getElementById("jsVolumeButton");
const fullScreenBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");

// Play버튼을 제어하는 함수
const handlePlayClick = () => {
  // paused속성은 미디어 요소(video나 audio)가 정지상태인지 여부를 체크한다.
  // paused속성은 Read Only라고 적혀있는데 이건 프로퍼티 값을 수정할 수 없고 오직 읽기만 가능하다는 의미이다.
  // video(video태그)를 가져와서 paused속성을 통해 pause(정지)여부를 체크함
  // 정지(pause) 여부에 따라 true(정지 상태) or false(재생 상태)를 반환함
  // MDN 참조: https://developer.mozilla.org/ko/docs/Web/API/HTMLMediaElement
  if (video.paused) {
    // play()메소드는 미디어 요소를 재생함
    video.play();
    playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
  } else {
    // pause()메소드는 미디어 요소의 재생을 일시정지함
    video.pause();
    playBtn.innerHTML = `<i class="fas fa-play"></i>`;
  }
};

// Volume버튼을 제어하는 함수
const handleVolumeClick = () => {
  // console.log(video.muted);

  // muted속성은 미디어 요소가 음소거 상태인지 여부를 체크한다.
  // 음소거라면 true를 음소거가 아니라면 false를 반환한다.
  // muted속성은 위에 pause와 다르게 Read Only가 아니기 때문에 프로퍼티 값을 수정할 수 있다.
  // (muted의 값을 true, false를 줘서 바꿀 수 있다는 의미이다.)
  if (video.muted) {
    video.muted = false;

    // 아래에 event.target.value값을 넣어줬던 video.volume을 가져와서 volumeRange.value값에 넣어줌
    //(음소거 처리할 때 video.volume값은 바꾸지 않고 video.muted로 음소거 처리를 했기 떄문에 video.volume값은 그대로 남아있어서 여기에 가져와서 쓸 수 있는 것이다. )
    volumeRange.value = video.volume;

    // 음소거를 했다가 해제후에도 볼륨의 이미지를 다르게 보여주도록 함
    if (video.volume >= 0.6) {
      volumeBtn.innerHTML = `<i class="fas fa-volume-up"></i>`;
    } else if (video.volume >= 0.2) {
      volumeBtn.innerHTML = `<i class="fas fa-volume-down"></i>`;
    } else {
      volumeBtn.innerHTML = `<i class="fas fa-volume-off"></i>`;
    }
  } else {
    video.muted = true;
    volumeBtn.innerHTML = `<i class="fas fa-volume-mute"></i>`;
    volumeRange.value = 0;
  }
};

// Full로 변경된 Screen을 Exit하는 함수
const exitFullScreen = () => {
  // exitFullScreen()은 Full스크린 되어있는 화면을 나가는 함수이다.
  // 주의할 점은 앞에 선택자가 requestFullscreen()할 때 썼던 videoPlayer가 아닌 document라는 점이다.
  // exitFullScreen또한 브라우저가 지원하지 않는다면 앞에 prefix를 써서 호출해야 한다.
  document.exitFullscreen().catch((err) => Promise.resolve(err));
  fullScreenBtn.innerHTML = `<i class="fas fa-expand"></i>`;
  fullScreenBtn.removeEventListener("click", exitFullScreen);
  fullScreenBtn.addEventListener("click", goFullScreen);
};

// Screen을 Full로 변경하는 함수
const goFullScreen = () => {
  // 화면을 풀스크린으로 변경하는 속성은 따로 없기 때문에 EventListener를 추가하고 제거하는 방식으로 화면을 확장하고 축소해야 한다.
  // requestFullscreen()함수를 통해 videoPlayer(video태그를 감싸는 부모태그)를 전체화면으로 꽉 채운다.
  // 여기서 주의할 점은 video태그에 requestFullscreen()을 주면 안된다.
  // 왜냐하면 video태그에 requestFullscreen()함수를 실행하게 되면 video태그가 전체화면으로 커지게 되면서 video태그가 기본적으로 가지고 있는 control(재생,볼륨,전체화면 버튼 등)바를 가져와 버린다.
  // 현재 우리는 video태그가 기본적으로 가지고 있는 controls버튼들을 사용하는게 아닌 커스터마이징해서 만들고 있기 때문에 video태그의 control바를 활성화 시키면 안된다.
  // 현재 크롬 브라우저에서는 지원하지만 강의 촬영 당시에는 requestFullscreen()함수를 완전하게 지원하지 않았다.
  // 그래서 이런 경우에는 앞에 prefix를 써서 호출해야 한다.
  // prefix는 브라우저마다 다른데 구글은 webkit이고 앞에 webkit을 붙여 webkitRequestFullscreen()으로 써주면 된다.
  // webkit은 구글 크롬 브라우저가 사용하는 엔진이다. 만약 파이어폭스에서 사용하고 싶다면 webkit대신 moz를 써서 mozRequestFullscreen()으로 써줘야 한다.
  videoPlayer.requestFullscreen();
  fullScreenBtn.innerHTML = `<i class="fas fa-compress"></i>`;
  fullScreenBtn.removeEventListener("click", goFullScreen);
  fullScreenBtn.addEventListener("click", exitFullScreen);
};

// 현재 Screen이 전체화면인지 아닌지 체크하는 함수
const checkScreen = () => {
  // fullscreenElement 속성을 통해 현재 document가 전체화면인지 아닌지 체크할 수 있다.
  // 전체화면이라면 전체화면인 태그를 반환하고 아니라면 null을 반환한다.
  const checkFullScreen = document.fullscreenElement;
  if (checkFullScreen === null) {
    // 콘솔창에 Promise관련 오류가 나서 document.exitFullscreen().catch((err) => Promise.resolve(err));로 써줬음
    // document.exitFullscreen().catch((err) => Promise.resolve(err));
    fullScreenBtn.innerHTML = `<i class="fas fa-expand"></i>`;
    fullScreenBtn.removeEventListener("click", exitFullScreen);
    fullScreenBtn.addEventListener("click", goFullScreen);
  } else {
    videoPlayer.addEventListener("dblclick", exitFullScreen);
    fullScreenBtn.innerHTML = `<i class="fas fa-compress"></i>`;
  }
};

const formatDate = (seconds) => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }

  return `${hours}:${minutes}:${totalSeconds}`;
};

const getCurrentTime = () => {
  // currentTime은 미디어의 현재 재생 시점을 초 단위로 반환한다.
  currentTime.innerHTML = formatDate(Math.floor(video.currentTime));
  // console.log(video.currentTime);
};

const setTotalTime = () => {
  // duration속성은 미디어의 전체 길이를 초 단위로 반환한다.
  // console.log(video.duration);

  const totalTimeString = formatDate(video.duration);
  // console.log(totalTimeString);

  totalTime.innerHTML = totalTimeString;

  // setInterval()을 쓰거나 아래와 같이 timeupdate를 쓸 수 있다.
  // timeupdate는 비디오/오디오의 재생위치가 변경되었을 때를 말한다.
  // setInterval(getCurrentTime, 100);
  video.addEventListener("timeupdate", getCurrentTime);
};

const handleEnded = () => {
  // console.log(video.ended);
  if (video.ended === true) {
    // currentTime속성에 값을 주게 되면 미디어는 그 값에 해당하는 재생시간으로 변경한다. 예를들어 0으로 주게 되면 currentTime을 0초로 돌린다는 의미이다.
    video.currentTime = 0;
    playBtn.innerHTML = `<i class="fas fa-play"></i>`;
  }
};

const handleDrag = (event) => {
  // event.target.value값을 가져옴
  const {
    target: { value },
  } = event;
  // console.log(value);

  // volume속성은 미디어가 재생될 볼륨을 설정한다.
  // 주의! volume속성의 값은 0과 1사이에서만 가능하기 때문에 input range를 만들 때 min은 0으로 max는 1로해서 그 안에서 움직여야 한다.
  video.volume = value;

  // 조건문을 통해 value에 따라 볼륨의 이미지를 다르게 보여주도록 함
  if (value >= 0.6) {
    volumeBtn.innerHTML = `<i class="fas fa-volume-up"></i>`;
  } else if (value >= 0.2) {
    volumeBtn.innerHTML = `<i class="fas fa-volume-down"></i>`;
  } else {
    volumeBtn.innerHTML = `<i class="fas fa-volume-off"></i>`;
  }
};

const init = () => {
  playBtn.addEventListener("click", handlePlayClick);
  volumeBtn.addEventListener("click", handleVolumeClick);
  fullScreenBtn.addEventListener("click", goFullScreen);
  document.addEventListener("fullscreenchange", checkScreen);
  video.addEventListener("dblclick", goFullScreen); // dblclick: 더블클릭했을 때 발생하는 이벤트이다.
  video.addEventListener("loadedmetadata", setTotalTime); // loadedmetadata: 미디어의 메타 데이터가 로드되었을 때 발생하는 이벤트이다.
  setTotalTime();
  video.addEventListener("ended", handleEnded); // ended: 미디어 요소가 끝에 도달해서 재생 또는 스트리밍이 중지됐을 때 발생하는 이벤트이다.
  volumeRange.addEventListener("input", handleDrag);
};

// if문을 통해 videoPlayer가 있으면 init함수를 실행하도록 한다.
// 왜냐하면 모든 페이지에 videoPlayer가 있는 것이 아니기 때문에 videoPlayer가 없는 페이지에서 init함수를 실행하게 되면 오류가 나기 때문이다.
if (videoPlayer) {
  init();
}
