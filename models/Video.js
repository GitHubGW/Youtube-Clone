import mongoose from "mongoose";

// new mongoose.Schema({})를 통해서 스키마를 생성하고 생성한 스키마에서 데이터 형태에 대해 정의해줌
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
});

// 데이터 형태를 정의해 둔 스키마를 통해서 실제 데이터(모델)를 만듬
// 모델의 이름은 Video가 되고 Video 모델의 스키마는 VideoSchema가 된다
const model = mongoose.model("Video", VideoSchema);

export default model;
