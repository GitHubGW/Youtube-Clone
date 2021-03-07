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
    // console.log("videos:", videos);
    throw Error("Error 발생"); // throw 문은 사용자 정의 예외를 던질 수 있다. 현재 함수의 실행이 중지되고 (throw 이후의 명령문은 실행되지 않습니다.), 컨트롤은 콜 스택의 첫 번째 catch 블록으로 전달됩니다.
    res.render("home", { pageTitle: "Home", videos }); // home.pug대신 그냥 home만 써도 됨.
  } catch (error) {
    // console.log("throw문에서 던진 Error: ", error); // 위에 try문에 에러가 있다면 throw문을 통해 에러를 던질 수 있고 그 던진 에러는 밑에 catch문에 error파라미터로 받아서 보여줄 수 있다.

    // find()메소드는 데이터베이스에서 데이터를 조회 할 때 사용한다. query를 파라미터 값으로 전달 할 수 있으며, 파라미터가 없을 시, 모든 데이터를 조회합니다. 데이터베이스에 오류가 발생하면 HTTP Status 500과 함께 에러를 출력합니다.
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
export const postUpload = async (req, res) => {
  // req객체안에서 body프로퍼티 안에 있는 프로퍼티들, file프로퍼티 안에 있는 path를 가져옴
  // 밑의 코드는 ES6방식으로 객체 안에 있는 프로퍼티를 불러오는 것으로 const videoTitle = req.body.videoTitle, const path = req.file.path와 같은 의미이다. 그래서 바로 videoTitle과 path를 변수로 꺼내 쓸 수 있다.
  const {
    body: { videoTitle, description },
    file: { path },
  } = req;

  console.log("req.file:", req.file);

  // Video.create()은 비디오 도큐먼트에 새로운 도큐먼트를 생성한다는 의미이다.
  // 중요! 도큐먼트를 생성하게 되면 Video.js에서 스키마를 생성할 때 만든 형태로 도큐먼트를 만들게 되는데 거기에는 fileUrl, title, description, createdAt, views, comments등이 있다.
  // 거기 안에 있는 fileUrl, title, descriptoin의 값을 여기서 넘겨준 것이다.
  // 그런데 스키마를 생성할 때 선언해 준 fileUrl등의 프로퍼티 외에도 _id라는 고유의 id값도 자동으로 만들어서 넘겨주게 되는데 이 id값을 통해 각각의 비디오를 구분할 수 있고 비디오를 클릭했을 때 비디오 고유의 아이디 값을 가진 라우터로 이동할 수 있다.
  const newVideo = await Video.create({
    fileUrl: path,
    title: videoTitle,
    description: description,
  });
  console.log(newVideo);
  console.log(newVideo.id);

  // 파일을 업로드하게 되면 multer가 req.file 안에 그 파일에 대한 정보들을 보여준다. (ex: 오리지널 파일 이름, 위치, multer가 저장하는 파일 이름, *path(위치) 등등)
  // console.log("body: ", body, "file: ", file);

  // 중요! 비디오를 업로드하고 나서 우리가 필요한 것은 비디오 파일의 이름이 아니라 파일의 위치이다.
  // 그 이유는 비디오 파일 자체는 서버에 있고 우리는 서버로부터 비디오 파일의 URL이나 위치 정보를 통해 비디오를 가져오기 때문이다.
  // res.redirect(routes.videoDetail(1));

  // res.redirect()를 통해 위에서 비디오 도큐먼트를 생성하면서 할당받은 고유의 id값을 넘겨준다.
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  // req객체안에는 params라는 프로퍼티가 있고 params안에는 { id: '6044bf41158be23628e15dfe' } 이런식으로 객체를 가지고 있다
  // 이 값은 우리가 라우터를 설정할 때 /:id 이렇게 설정했던 id부분에 들어가는 값을 의미한다.
  // req.params를 통해 우리는 URL로부터 정보를 가져올 수 있다
  // console.log(req.params);

  const {
    params: { id },
  } = req;

  // try catch문을 통해 존재하는 비디오 파일 URL경로에 들어왔을 때는 비디오를 보여주고 잘못된 URL경로로 들어왔을 때는 다시 home라우터로 리다이렉트 시켜준다.
  try {
    // Video모델에서 findById()메소드를 통해 req.parms.id값과 매칭하는 파일을 찾는다. 찾은 값을 통해 해당 비디오 파일을 찾을 수 있다.
    // Video모델의 스키마 안에서는 id값을 선언하지 않았지만 비디오가 업로드되는 시점에 각각의 비디오에게 MongoDB가 자동으로 고유의 id값을 주게 되고 그 id값을 통해 여기서 req.params.id와 일치하는 비디오를 가져올 수 있는 것이다.
    const video = await Video.findById(id);
    console.log("✅ video:", video);
    res.render("videoDetail", { pageTitle: "videoDetail", video });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const video = await Video.findById(id);
    console.log("✅ video: ", video);
    res.render("editVideo", { pageTitle: `Edit: ${video.title}`, video });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;

  try {
    // findOneAndUpdate()메소드를 통해 비디오 모델에서 해당 조건에 해당되는 비디오를 찾아서 업데이트 시켜주는 메소드이다.
    // findOneAndUpdate(조건, 업데이트, 옵션, 콜백)는 여러 인자들을 받을 수 있다. 첫 번째 인자는 조건에 해당 되는 값을 찾고, 두 번쨰 인자는 업데이트 할 값을 넣는다.
    // _id라고 한 이유는 우리가 비디오를 업로드하면 MongoDB가 고유의 id값을 할당해주는데 그 때 id가 아니라 정확하게는 _id라는 이름으로 할당해준다. (이건 그냥 콘솔로그 찍어보면 나옴)
    // 그래서 해당 모델이 가지고 있는 _id 값과 req.params.id 값이 일치하는 조건의 비디오를 찾아서 그 비디오의 title과 descripption의 값을 req.body.title, req.body.description의 값으로 업데이트 하라는 의미이다.
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const deleteVideo = (req, res) => res.render("deleteVideo", { pageTitle: "deleteVideo" });
