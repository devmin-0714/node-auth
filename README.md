# Node-Auth
[Code Github]](https://github.com/dipakkr/node-auth)
[Blog](https://dev.to/dipakkr/implementing-authentication-in-nodejs-with-express-and-jwt-codelab-1-j5i)

## 목차
1. 소개
2. 필요사항
3. 필요한 툴과 패키지들
4. 프로젝트 세팅
5. MongoDB Database 세팅
6. User Model 설정
7. User Signup
8. User Login
9. 로그인된 User 정보 가져오기
10. 마치며

## 1. 소개
**인증(Authentication)** - 사용자의 일치를 확인하는 과정
**인가(Authorization)** - 허가된 작업인지를 확인후 권한부여

## 2. 필요사항
`node js`의 설치가 필요하다.

## 3. 필요한 툴과 패키지들
1. **express**
Express는 Node.js Web Application 프레임워크이

2. **express-validator**
Express 프레임워크의 서버의 데이터를 검증하기 위한 서버사이드 라이브러리

3. **body-parser**
Body 데이터를 파싱하기 위한 Node.js의 미들웨이

4. **bcryptjs**
암호를 hash 하고 DB에 저장하며, 관리자도 접근할 수 없는 라이브러리

5. **jsonwebtoken**
회원가입의 데이터 playload(사용에 있어서 전송되는 데이터)를 암호화 하고 토큰을 리턴해주며 토큰은 보안된 페이지를 인증하는데 사용할 수 있다.

6. **mongoose**
MongoDB Ojbect modeling 툴로써 비동기 환경이며, promise와 callbacks 모두 지원한다.


## 4. 프로젝트 세팅
$ npm init -y
$ npm install express express-validator body-parser bcryptjs jsonwebtoken mongoose --save

```js
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// PORT
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});


app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
```
