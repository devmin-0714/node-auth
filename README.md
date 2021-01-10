# Node-Auth
[Code Github]](https://github.com/dipakkr/node-auth)
[Blog](https://dev.to/dipakkr/implementing-authentication-in-nodejs-with-express-and-jwt-codelab-1-j5i)

## 목차
1. 소개
2. 필요사항
3. 필요한 툴과 패키지들
4. 프로젝트 세팅
5. MongoDB 데이터베이스와 User Model 설정
6. User Signup
7. User Login
8. 로그인된 User 정보 가져오기
9. 마치며

## 1. 소개
**인증(Authentication)** - 사용자의 일치를 확인하는 과정<br>
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
$ npm init -y<br>
$ npm install express express-validator body-parser bcryptjs jsonwebtoken mongoose --save

```js
// index.js
const express = require('express');

const app = express();

// PORT
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.json({ message: 'API Working' });
});


app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
```

## 5. MongoDB 데이터베이스와 User Model 설정
[MongoDB](https://www.mongodb.com/3)
[MongoDB Doc](https://docs.mongodb.com/manual/)

1. 데이터베이스 생성
Clusters-Create Database : users collection 생성

2. 데이터베이스 연결 정보 가져오기 
Clusters-CONNECT-Connect Your application
`mongodb+srv://devPark:<password>@react-boiler-plate.ovbtd.mongodb.net/<dbname>?retryWrites=true&w=majority`

3. User Model 설정
```js
// config/db.js
const mongoose = require('mongoose');

const MongoServer = async () => {
    try {
        await mongoose.connect(MongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Connected to MongoDB !!');
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = MongoServer;
```

4. User Model 생성
```js
// models/User.js
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('User', UserSchema);
```
