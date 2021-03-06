import routes from "../routes";
import Video from "../models/Video"; // Video.js에서 Video모델을 가져옴

// Global Controller
// res.render()함수는 설정된 views폴더에서 자동으로 템플릿 파일을 찾아서 랜더링한다.
// 즉 views폴더에 있는 home.pug파일을 찾아서 랜더링 시킴
// res.render()함수는 첫 번째 인자로는 템플릿을 두 번째 인자로는 앞에 템플릿에 추가할 정보가 담긴 객체를 넘겨줌
// async(동시에 발생하지 않는) await(기다리다) 는 자바스크립트로 다음 처리를 하지 않고 기다리게 해준다.
export const home = async (req, res) => {
  // await은 다음 과정이 끝날 때까지 기다려달라는 의미이다. (비디오를 찾을 때까지 기다려달라)
  // await은 성공의 여부랑은 상관이 없다. 해당 부분이 끝날 때까지 자바스크립트에게 다음 코드를 실행하지말고 기다리라는 의미이다 (에러가 생겨도 처리가 끝났다면 다음 부분을 실행함)
  // try는 우리가 처리 해야 할 부분이고 catch는 try 부분이 실패했을 때 해당 error를 반환한다.
  try {
    const videos = await Video.find({}); // Video모델에 find()메소드를 써서 Video 데이터베이스에 있는 모든 비디오를 가져온다.
    throw Error("Error 발생"); // throw 문은 사용자 정의 예외를 던질 수 있다. 현재 함수의 실행이 중지되고 (throw 이후의 명령문은 실행되지 않습니다.), 컨트롤은 콜 스택의 첫 번째 catch 블록으로 전달됩니다.
    res.render("home", { pageTitle: "Home", videos }); // home.pug대신 그냥 home만 써도 됨.
  } catch (error) {
    console.log("throw문에서 던진 Error: ", error); // 위에 try문에 에러가 있다면 throw문을 통해 에러를 던질 수 있고 그 던진 에러는 밑에 catch문에 error파라미터로 받아서 보여줄 수 있다.
    const videos = await Video.find({});
    res.render("home", { pageTitle: "Home", videos });
  }
};
export const search = (req, res) => {
  // req.query에는 사용자가 입력한 form에 대한 정보가 들어있다.
  // const searchingBy = req.query.term;
  // 위의 req.query.term을 새로운 ES6 방식으로 구현함
  const {
    query: { term: searchingBy },
  } = req;
  res.render("search", { pageTitle: "Search", searchingBy: searchingBy, videos }); //videos: videos같이 키와 벨류값이 같으면 videos로만 써도 가능함.
};

// Video Controller
export const video = (req, res) => res.render("video", { pageTitle: "Video" });

export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "Upload" });
};
export const postUpload = (req, res) => {
  // console.log("req.body", req.body);
  const {
    body: { videoFile, videoTitle, description },
  } = req;
  res.redirect(routes.videoDetail(1));
};

export const videoDetail = (req, res) => res.render("videoDetail", { pageTitle: "videoDetail" });
export const editVideo = (req, res) => res.render("editVideo", { pageTitle: "editVideo" });
export const deleteVideo = (req, res) => res.render("deleteVideo", { pageTitle: "deleteVideo" });
