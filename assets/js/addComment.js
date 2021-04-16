// axios는 http request요청을 할 때 사용하는 라이브러리이자 npm모듈이다.
import axios from "axios";

const addCommentForm = document.getElementById('jsAddComment');
const commentList = document.getElementById('jsCommentList');
const commentNumber = document.getElementById('jsCommentNumber');





// 가짜 댓글 작성시 comments의 숫자를 늘리는 함수
const increaseNumber = () => {
  // 댓글을 작성했을 때 댓글의 갯수를 알려주는 commentNumber를 가져와서 parseInt를 통해 정수로 변환해준 후 다시 commentNumber에 넣어 댓글 갯수 값을 업데이트해준다. 
  // parseInt(값, 10)은 값을 10진수의 정수로 변환한다는 의미이다.
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10)+1;
}

// 댓글을 작성시 가짜로 댓글을 추가하는 함수
const addComment = (comment) => {
  const li = document.createElement('li');
  const span = document.createElement('span');

  // appendChild()메서드를 이용해서 span태그를 li태그에 추가함
  li.appendChild(span);

  span.innerHTML = comment;

  // prepend()메서드를 이용해서 commentList에 가장 맨 앞에 차례대로 li태그를 추가한다.
  // (댓글을 먼저 단 것이 아래로 가고 최근에 단 것이 위로 올라올 수 있도록 하기 위해 append가 아닌 prepend를 사용했다.)
  commentList.prepend(li);

  increaseNumber();
}

const sendComment = async (comment) => {
  // console.log(comment);
  const videoId = window.location.href.split("/videos/")[1];

  // axios()를 통해 ()괄호 안에 axios설정을 통해 해당 URL경로로 API를 요청할 수 있다. (추가로 method 및 여러 설정들을 지정할 수 있다.)
  // axios()가 실행되고 난 후 response로 실행결과를 객체 형태로 반환해줌.
  // fetch()와 비슷하지만 좀 더 자세하게 설정할 수 있다. 
  const response = await axios({
    url: `/api/${videoId}/comment`, // api url주소
    method: "POST", // api를 요청할 때 method방식
    data: { // api url주소로 전달할 data(위에서 받은 comment를 전달함)
      comment
    }
  });
  console.log(response);

  // 만약 response.status가 200이면(axios가 성공적으로 실행됐다면) addComment(comment)함수를 실행한다. 
  if(response.status === 200){
    addComment(comment);
  }

}

const handleSubmit = (event) => {
  // form태그에서 submit했을 때 기본적으로 페이지가 새로고침이 된다. 
  // 그런데 우리는 페이지가 새로고침되는 것을 막기 위해 event.preventDefault()를 해줬다. 
  event.preventDefault();

  const commentInput = addCommentForm.querySelector('input');
  const comment = commentInput.value;

  // sendComment(comment)함수로 input의 value값이 들어있는 comment를 넣음
  sendComment(comment);

  // commentInput을 전송하고 난 후에는 value값을 비워준다. 
  commentInput.value = "";
}

const init = () => {
  addCommentForm.addEventListener('submit', handleSubmit);
}

if (addCommentForm) {
  init();
}