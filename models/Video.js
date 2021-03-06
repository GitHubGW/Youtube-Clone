import mongoose from "mongoose";

// new mongoose.Schema({})를 통해서 스키마를 생성하고 생성한 스키마에서 데이터 형태에 대해 정의해줌
// 스키마는 모델의 형식으로서 모델이 가져야 할 기본적인 요소들을 정의한다
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
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      // 여기에는 모든 Commnet 모델의 정보를 넣는 것이 아니라 Commnent들의 고유 id값만 넣는 것이다.
      // ObjectId에는 비디오 생성시 자동으로 생성된다.
      type: mongoose.Schema.Types.ObjectId,
      // Relationship(관계): 서로 다른 스키마를 가진 데이터가 연관성을 가지고 있을 때 서로의 스키마를 ref를 통해 연결시켜주는 것이다
      // (단, 데이터 전체를 통으로 연결시켜주는 것이 아니라 id값(데이터의 고유값)만 넘겨줘서 연결시켜준다)
      // ref(참조): Comment.js에서 CommentSchema를 통해 만든 Comment모델을 여기에 참조시켜준다.
      ref: "Comment",
    },
  ],
});

// 데이터 형태를 정의해 둔 스키마를 통해서 실제 데이터(모델)를 만듬
// 모델의 이름은 Video가 되고 Video 모델의 스키마는 VideoSchema가 된다
const model = mongoose.model("Video", VideoSchema);

export default model;
