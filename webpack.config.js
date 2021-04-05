// webpack.config.js는 webpack이 호출되면 가장 먼저 확인하는 설정 파일입니다.
// 설치한 패키지 중 webpack은 파일안에서 사용하는 패키지이고 webpack-cli는 콘솔에서 사용하는 패키지이다. 
// package.json에서 dev:assets 을 설정해 웹팩을 실행시키는 커맨드를 설정했다.
// npm dev:assets를 하게 되면 웹팩은 자동으로 webpack.config.js파일을 찾아서 실행한다. (webpack.config.js 파일명은 웬만하면 수정하지 말기)
// 기본적인 웹팩의 규칙은 exported configuartion object를 찾는 것이다.
// webpack.config.js파일에서는 모던 자바스크립트 문법(최신 자바스크립트 문법)을 쓸 수 없다. (babel을 이용한 최신 자바스크립트 코드를 여기선 쓸 수 없다.)
// config파일은 서버 코드와 분리되어 있는 100퍼센트 클라이언트 코드이기 때문에 최신 문법을 사용할 수 없다.

// path는 node.js에 기본적으로 포함된 패키지로 프로젝트 내에서 절대 경로를 사용할 수 있도록 해준다.
// path 모듈은 파일과 디렉토리 경로를 절대 경로로 만들어 주는 역할을 한다. (절대 경로로 찾게 되면 파일이 어디에 있던지 간에 쉽게 찾을 수 있다.)
const path = require("path");
const autoprefixer = require("autoprefixer");

// 원래는 extract-text-webpack-plugin를 강의에서 사용했으나 webpack 4와의 호환을 위해서 mini-css-extract-plugin 로 대체해서 실습했다.
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// process.env를 통해 dotenv에서 변수를 가져오듯이 package.json의 script부분에 설정한 WEBPACK_ENV의 값을 가져옴
// 가져오는 이유는 환경변수의 값을 가져와서 웹팩에 mode 옵션을 설정해주기 위함이다.
// mode를 설정해주는 이유는 우리가 배포를 할 때 코드를 압축하는데 개발중에는 에러를 봐야하기 때문에 코드를 압축하지 않는다. 
// 그래서 현재 개발중인지 배포중인지 mode를 통해 알려줘야 한다. 
const MODE = process.env.WEBPACK_ENV;

// 웹팩은 entry와 output이 있다.
// entry는 앱의 루트 파일 경로로서 변환할 파일을 지정하고 output은 그 파일을 변환해서 최종적으로 어디에 위치할 것인지를 지정한다.
// __dirname은 현재 실행되고 있는 프로젝트를 의미한다. 그래서 현재 프로젝트 내에서 어디든 접근 가능하도록 해주는 nodejs 전역 변수이다.
// __dirname 은 현재 실행 중인 프로젝트
// __filename 은 현재 실행 중인 파일 경로
// path.join()과 path.resolve()메소드를 통해 파일의 경로를 찾아서 지정할 수 있다.
// path.join()은 왼쪽에서부터 경로를 읽고 path.resolve()는 오른쪽에서부터 경로를 읽어서 파일을 찾는다.
// path.resolve(__dirname, "assets", "js", "main.js"): 현재 실행중인 프로젝트인 Youtube-Clone에서 assets/js/main.js파일을 찾아라.
const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");

// path.join(__dirname, "static"): 현재 실행중인 프로젝트인 Youtube-Clone에서 static폴더를 지정함.
const OUTPUT_DIR = path.join(__dirname, "static");

// config파일에는 웹팩에게 설정해야 하는 것들을 지정해 준다. (웹팩은 loader를 읽을 때 아래에서 위로 읽으면서 실행한다.)
// entry에는 변환할 파일을, output에는 (객체형식으로)변환할 파일을 저장할 폴더의 경로나, 변환할 파일명을 filename에 입력해준다.
const config = {

  // babel-polyfill은 ES6+에서 새롭게 추가된 Promise, WeakMap와 같은 내장객체나 Array.from, Object.assign와 같은 정적 메소드를 구형 브라우저에서도 작동할 수 있도록 변환해주는 도구다.
  // 쉽게 말해 ES6+에서 새롭게 추가된 객체나 메소드들을 구형 브라우저에도 작동할 수 있도록 변환해준다는 것이다.
  // babel은 ES6+의 문법을 구형 브라우저에서도 작동할 수 있도록 변환해주는 것이라면 babel-polyfill은 ES6+ 이상에서 새롭게 추가된 객체들을 구형 브라우저에서도 작동할 수 있도록 변환해주는 것이다.
  // babel 7.4.0부터는 babel-polyfill을 직접 사용하므로 이젠 따로 설치할 필요가 없어지게 되었다.
  entry: ["@babel/polyfill", ENTRY_FILE], // 웹팩의 entry를 설정해주는 프로퍼티
  mode: MODE, // 웹팩의 환경변수를 설정해주는 프로퍼티
  module: {
    // 웹팩이 모듈(여기서는 scss나 js파일 같은 것들을 말함)을 만났을 때 아래와 같은 rule을 따르라고 설정해주는 프로퍼티
    // 룰의 내용은 아래와 같다.
    // test에는 조건을 만들고 그 조건에 해당하는 파일을 찾는다.
    // test에 해당하는 조건(이 경우엔 .js나 .scss, .sass)을 만나게 되면 아래 use에 있는 로더들을 실행하게 된다.
    rules: [
      // JS에 대한 규칙을 설정함
      {
        test: /\.(js)$/,
        use: [
          {
            // babel-loader 로더는 최신 자바스크립트 문법을 오래된 자바스크립트 문법으로 변환해준다.
            loader: "babel-loader",
          },
        ],
      },

      // CSS에 대한 규칙을 설정함
      {
        test: /\.(scss|sass)$/, // 웹팩이 정규표현식을 통해 파일 이름을 검사해서 scss, sass파일 전부를 찾아줌.

        // use 안에는 사용할 플러그인이나 로더들을 정의해준다.
        // 우리는 loader를 통해 웹팩에게 파일을 변환하고 처리하는 방법에 대해서 명령을 내리는 것이다. 
        // 1. sass-loader로 SCSS파일을 CSS로 변환해준다.
        // 2. postcss-loader로 변환한 CSS에 브라우저 호환성 문제를 해결해준다.
        // 3. css-loader를 통해 최종적으로 변환된 CSS를 가져온다.
        // 4. MiniCssExtractPlugin.loader를 통해 변환된 CSS를 별도의 파일로 추출한다.
        // 여기서 주의할 점은 로더(loader)는 웹팩에서 아래부터 위로 역순으로 실행한다. 
        use: [
          {
            // 4. 그리고 마지막으로 MiniCssExtractPlugin.loader를 통해 가져온 CSS를 별도의 파일로 추출한다.
            // CSS가 포함된 JS파일별로 CSS파일을 생성한다.
            loader: MiniCssExtractPlugin.loader,
          },
          {
            // 3. css-loader는 변환된 CSS를 가져온다.
            loader: "css-loader",
          },
          {
            // 2. postcss-loader는 CSS에 대한 특정 플러그인들을 실행시켜준다.
            // 여기서는 postcss-loader가 autoprefixer라는 플러그인을 실행시켜줬다. (autoprefixer는 호환성 문제를 해결해주는 플러그인이다.)
            // autoprefixer 플러그인의 옵션으로는 99.5% 이상의 브라우저에서 호환되는 CSS 코드로 변환해주는 옵션을 지정했다.
            // 예를 들어 IE와 호환되게 만들고 싶다면 autoprefixer가 그것을 해줄 수 있는 것이다. (접두사 prefix부터 잡다한 것까지 모두 처리해준다.)
            loader: "postcss-loader",
            options: {
              postcssOptions: {

                // plugins: [[autoprefixer, { browsers: "cover 99.5%" }]]에서 browsers는 오래된 옵션이기 때문에 에러가 발생할 수 있다고 경고 하고 있다.
                // 그래서 browser대신 overrideBrowserslist옵션으로 대체했다. (강의에서는 browser로 함)
                plugins: [[autoprefixer, { overrideBrowserslist: "cover 99.5%" }]],
              },
            },
          },
          {
            // 1. sass-loader는 Sass, Scss를 CSS로 변환해준다.
            loader: "sass-loader",
          },
        ],
      },
    ],
  },

  // output은 반드시 객체형태로 써줘야 한다. 
  output: {

    // path에는 웹팩의 output을 설정해준다. (파일이 컴파일되고 위치할 경로)
    path: OUTPUT_DIR,

    // filename은 컴파일될 파일 형식을 설정한다.
    // [name].js의 의미는 어떤 이름 + .js 파일 형식을 가질 것이라고 정의해주는 것이다.
    filename: "[name].js", 
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
  ],
};

// export default는 최신 문법이기 때문에 여기서 쓸 수 없기 때문에 옛날 문법인 module.exports를 이용해 export해준다.
// export default config 사용불가(x)
module.exports = config;
