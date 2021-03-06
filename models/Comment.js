import mongoose, { Mongoose } from "mongoose";
const { Schema } = mongoose;

const CommentSchema = new Schema({
  text: {
    type: String,
    required: "Text is required",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const model = mongoose.model("Comment", CommentSchema);

export default model;
