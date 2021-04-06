import mongoose from "mongoose";

// passport-local-mongoose는 몽구스의 플러그인중 하나로서 패스포트로 username과 비밀번호를 이용한 로그인 구축하는 것을 간단하게 해주는 패키지이다.
// passport-local-mongoose 모듈은 기본적인 사용자 인증에 필요한 것들을 만들어준다.
// 예를들면 패스워드 변경, 확인, 생성, 암호화 등등 모든 어플리케이션이 기본적으로 필요로 하는 것들을 자동으로 해주는 것이다.
import passportLocalMongoose from "passport-local-mongoose";

// UserSchema를 생성함
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  avatarUrl: String,
  githubId: Number,
  kakaoId: Number,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
});

// UserSchema에 plugin()함수를 통해 플러그인을 추가 및 설정해준다.
// 여기서는 passportLocalMongoose를 추가해주고 usernameField옵션의 값을 email로 설정해줬다.
// username이 될 값의 field명을 email로 설정해줬기 때문에 Passport가 email인지 아닌지를 검사해서 인증해준다.
UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

// model을 생성함
const model = mongoose.model("User", UserSchema);

export default model;
