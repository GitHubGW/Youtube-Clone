import mongoose from "mongoose";

// [Schema]: model의 형식. model이 가졌으면 하는 요소들을 틀로 만들어줌.
// new mongoose.Schema({})를 통해서 스키마를 생성하고 생성한 스키마에서 데이터 형태에 대해 정의해준다.
// 스키마는 모델의 형식으로서 모델이 가져야 할 기본적인 요소들을 정의한다
// document의 구조가 어떻게 생겼는지 알려주는 역할을 합니다.
const VideoSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    required: "File URL is required",
  },
  title: {
    type: String,
    required: "Title is required",
  },
  description: String,
  views: {
    type: Number,
    default: 0, // default를 쓰면 해당 값의 기본 값을 설정할 수 있다.
  },
  createdAt: {
    type: Date,
    default: Date.now, // default로 Date.now(현재 시간)을 넣어줬다.
  },
  comments: [
    {
      // 여기에는 Commnet 모델이 가지고 있는 모든 데이터 정보들을 넣는 것이 아니라 Commnent 스키마들이 생성되면서 생기는 고유 id값 하나만 넣어 주는 것이다. (고유의 id값은 id를 지정하지 않아도 자동으로 생성해준다.)
      // 그리고 이 고유의 id값 하나만으로 어떤 Comment 모델인지 구별이 가능하다.
      // 만약 스키마를 생성할 때 new mongoose.Schema({})로 만들었다면 mongoose.Schema.Types.ObjectId로 써주면 되고 new Schema({})로 만들었다면 Schema.Types.ObjectId로 써주면 된다.
      // type: mongoose.Schema.Types.ObjectId의 의미는 ref인 Comment 스키마들이 생성될 때 받는 고유의 id값(정확하게는 ._id)을 타입으로 저장하겠다는 의미이다.
      // 즉 아래 type: mongoose.Schema.Types.ObjectId는 type: Comment._id와 같은 의미라고 보면 된다. (몽구스에게 여기에 다른 모델의 id를 저장하겠다고 하는 것임)
      type: mongoose.Schema.Types.ObjectId,

      // [Relationship]: 서로 다른 스키마를 가진 데이터가 연관성을 가지고 있을 때 서로의 스키마를 ref를 통해 연결시켜주는 것을 말함.
      // 중요! 단, 데이터 전체를 연결 시켜 주는 것이 아니라 id값(데이터의 고유값)만 넘겨줘서 연결시켜준다.
      // ref(참조): Comment.js에서 CommentSchema를 통해 만든 Comment모델을 여기에 참조시켜준다.
      // 연결되게 되면 Video모델은 Comment모델들의 고유의 id값을 type으로 가져온다.
      ref: "Comment",
    },
  ],
});

// mongoose.model("Video", VideoSchema): 몽구스를 이용해서 Video모델을 만들고 그 Video모델의 스키마는 VideoSchema로 설정함 (몽구스에게 Video모델은 VideoSchema의 형태를 가질 것이라고 말해준 것임)
// 모델의 이름은 Video가 되고 Video 모델의 스키마는 VideoSchema가 된다.
// 참고로 몽구스는 model()의 첫 번째 인자로 컬렉션 이름을 만듭니다. Video이면 소문자화 후 복수형으로 바꿔서 videos 컬렉션(모델)이 됩니다.
// 이렇게 강제로 몽구스가 이름을 바꿔버리는 것이 싫다면 세 번째 인자로 컬렉션 이름을 주면 된다. -> mongoose.model('Video', userSchema, '컬렉션(모델) 이름')
// 주의! 스키마를 만들었다면 꼭 서버 실행하는 부분(여기서는 init.js)에서 import해줘야 한다.
const model = mongoose.model("Video", VideoSchema);

export default model;
