import mongoose from "mongoose";

// passport-local-mongoose는 몽구스의 플러그인중 하나로서 패스포트로 username과 password를 이용한 로그인 구축하는 것을 간단하게 해주는 패키지이다.
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

// UserSchema에 plugin()함수를 통해 passportLocalMongoose 플러그인을 추가해주고 추가적인 설정으로 usernameField를 email로 설정해줬다.
// 우리가 현재 사용하는 local전략(LocalStrategy)은 username(아이디)과 password(비밀번호)로 인증하는 방식이다. 
// 그런데 현재 우리 프로젝트에서는 username에 username(sugar)대신 email(sugar@gmail.com) 방식으로 인증처리를 할 것이기 때문에 usernameField의 값을 email로 변경해준 것이다.
// username의 field명을 email로 설정해줬기 때문에(기본 값은 그냥 username 이름값) Passport는 이제 이메일+비밀번호 방식으로 인증 처리를 해준다.
// username에는 내 이름(sugar)이 올 수도 있고 아이디(4512341234)가 올 수도 있고 이메일(sugar@gmail.com)이 올 수도 있고 뭐든 올 수 있다.
// username을 email로 설정하는 게 사용자를 확인하고 인증처리하는데 편하다.
// 여기서 이렇게 UserSchema.plugin(passportLocalMongoose)을 통해 설정해놓으면 추후에 changePassword, setPassword, authenticate등과 같은 여러 API들을 사용할 수 있다. 
UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

// model을 생성함
const model = mongoose.model("User", UserSchema);

export default model;
