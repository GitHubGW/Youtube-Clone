const recorderContainer = document.getElementById('jsRecorderContainer');
const recordBtn = document.getElementById('jsRecordBtn');
const videoPreview = document.getElementById('jsVideoPreview');

let streamObject;
let videoRecorder;

const handleVideoData = (event)=>{
  console.log(event.data);
}

const startRecording = (stream)=>{
  console.log(streamObject);
  // MediaRecorder객체는 미디어를 녹화하기 위해 사용하는 객체이고 미디어를 녹화하기 위해서는 MediaStream(stream)객체를 받아야 한다.
  // new MediaRecorder(streamObject): streamObject를 이용해서 MediaRecorder객체를 생성함
  const videoRecorder = new MediaRecorder(streamObject);

  // dataavailable 이벤트는 MediaRecorder가 사용되기 위해 애플리케이션에 미디어 데이터를 제공 할 때 시작됩니다.
  // MediaRecorder는 기본적으로 한번에 모든 것을 저장한다. (전체 파일을 한번에 저장한다는 의미이다) 
  // 그래서 dataavailable 이벤트는 녹화가 끝났을 때 호출이 일어나면서 전체 파일을 얻을 수 있다. 
  // videoRecorder.ondataavailable = handleVideoData;
  videoRecorder.addEventListener('dataavailable', handleVideoData);

  // videoRecorder.start(): start메서드를 이용해서 녹화를 시작함(녹화를 시작하면 state상태가 recording으로 바뀐다.)
  // start()안에 숫자 값을 주면 ~초마다 한번씩 반복실행을 하게 만들 수 있다. 
  // 그런데 우리가 녹화를 하고 있는건 비트이다. 문제는 우리는 이 비트를 접근할 수 있지만 막상 그걸로 뭔가를 하고 있진 않다. 
  // 그래서 이 비트를 어디론가 보내야 한다. dataavailable
  videoRecorder.start(1000);

  // console.log(videoRecorder);
  recordBtn.addEventListener('click',stopRecording);

  // setTimeout(()=>{
  //   videoRecorder.stop();
  // },5000)
}

const stopRecording = ()=>{
  videoRecorder.stop();
  recordBtn.removeEventListener('click', stopRecording);
  recordBtn.addEventListener('click', getVideo);
  recordBtn.innerHTML = "Start Recording";

}

// 미디어 디바이스에 대한 mdn 링크: https://developer.mozilla.org/ko/docs/Web/API/MediaDevices
// MediaDevices(미디어 디바이스) 인터페이스는 카메라, 마이크, 공유 화면 등 현재 연결된 미디어 입력 장치로 접근과 접근 방법을 제공하는 것이다.
// 다시 말해 미디어 데이터를 제공하는 미디어 디바이스들인(ex. 카메라, 마이크 등등) 모든 하드웨어로 접근할 수 있는 방법이다.
const getVideo = async () => {
  // console.log(await navigator.mediaDevices.enumerateDevices());
  try{
    // navigator.mediaDevices는 읽기 전용 속성으로 카메라, 마이크 등 미디어 디바이스에 접근할 수 있는 MediaDevices객체를 반환한다.
    // getUserMedia()메서드는 사용자에게 미디어 입력 장치 사용 권한을 요청하고(미디어 디바이스에 접근하기 위한 권한을 물어봄), 
    // 사용자가 요청을 허용하면 MediaStream(stream)객체를 반환한다.
    // navigator.mediaDevices.getUserMedia()를 통해 미디어 디바이스로부터 stream을 가져온다. 
    // await를 써준 이유는 유저가 미디어 디바이스 접근 권한을 허용할 때까지 기다리기 위해서이다. 
    // getUserMedia()안에는 설정을 줄 수 있다. -> audio: true, video: true를 통해 오디오와 비디오의 접근 권한을 물어보도록 한다. 
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 } // true말고 { width: 1280, height: 720 } 이렇게 따로 값을 지정해 줄 수도 있다.
    });
    // console.log(stream);

    // 원래 video에 파일 경로를 지정할 때 src속성을 이용해서 지정한다. 하지만 stream은 파일이 아니기 때문에 src로 지정할 수 없다.
    // 그래서 srcObject를 통해 객체를 src하는 속성을 써서 stream객체를 지정한다.
    videoPreview.srcObject = stream;

    // play()메서도를 이용해서 비디오를 녹화한다.
    videoPreview.play();

    // muted속성을 통해 비디오를 음소거한다.(실제 녹화에는 녹음이 되지만 사용자가 자신의 목소리를 듣지 않게 설정함)
    videoPreview.muted=true;
    recordBtn.innerHTML = "Stop Recording";

    // stream값을 streamObject에 넣어서 startRecording함수의 인자로 전달함
    streamObject = stream;
    startRecording(stream);
  }catch(error){
    recordBtn.innerHTML = "Can't Record ❌";
  }finally{ 
    // finally절은 try, catch문 중 하나가 실행된 후 실행 결과에 상관없이 항상 실행이 된다.
    recordBtn.removeEventListener('click', getVideo);
  }

}

const init = () => {
  recordBtn.addEventListener('click', getVideo);
}

// recorderContainer가 존재하면 init()함수를 실행함
if(recorderContainer){
  init();
}