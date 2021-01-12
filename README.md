# Node-Auth

[Code Github](https://github.com/dipakkr/node-auth)<br>
[Blog](https://dev.to/dipakkr/implementing-authentication-in-nodejs-with-express-and-jwt-codelab-1-j5i)

## 목차

1. 소개
2. 필요사항
3. 필요한 툴과 패키지들
4. 프로젝트 세팅
5. MongoDB 데이터베이스와 User Model 설정
6. User Signup
7. User Login
8. 토큰을 이용해 로그인된 User 정보 가져오기

## 1. 소개

**인증(Authentication)** - 사용자의 일치를 확인하는 과정<br>
**인가(Authorization)** - 허가된 작업인지를 확인후 권한부여

## 2. 필요사항

`node js`의 설치가 필요하다.

## 3. 필요한 툴과 패키지들

1. **express**
   [express](https://github.com/expressjs/express)<br>
   Express는 Node.js Web Application 프레임워크

2. **express-validator**
   [express-validator](https://github.com/express-validator/express-validator)<br>
   Express 프레임워크의 서버의 데이터를 검증하기 위한 서버사이드 라이브러리

3. **body-parser**
   [body-parser](https://github.com/expressjs/body-parser)<br>
   Body 데이터를 파싱하기 위한 Node.js의 미들웨이

4. **bcryptjs**
   [bcryptjs](https://github.com/kelektiv/node.bcrypt.js/)<br>
   암호를 hash 하고 DB에 저장하며, 관리자도 접근할 수 없는 라이브러리

5. **jsonwebtoken**
   [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)<br>
   회원가입의 데이터 playload(사용에 있어서 전송되는 데이터)를 암호화 하고 토큰을 리턴해주며 토큰은 보안된 페이지를 인증하는데 사용할 수 있다.

6. **mongoose**
   [mongoose](https://github.com/Automattic/mongoose)<br>
   MongoDB Ojbect modeling 툴로써 비동기 환경이며, promise와 callbacks 모두 지원한다.

## 4. 프로젝트 세팅

$ npm init -y<br>
$ npm install express express-validator body-parser bcryptjs jsonwebtoken mongoose --save

```js
// index.js

const express = require("express");
const MongoServer = require("./config/db");

// Initiate Mongo server
MongoServer();

const app = express();

// PORT
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "API working" });
});

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
```

## 5. MongoDB 데이터베이스와 User Model 설정

[MongoDB](https://www.mongodb.com/3)<br>
[MongoDB Doc](https://docs.mongodb.com/manual/)

1. 데이터베이스 생성
   Clusters-Create Database : users collection 생성

2. 데이터베이스 연결 정보 가져오기
   Clusters-CONNECT-Connect Your application
   `mongodb+srv://devPark:<password>@react-boiler-plate.ovbtd.mongodb.net/<dbname>?retryWrites=true&w=majority`

3. User Model 설정

```js
// config/db.js

const mongoose = require("mongoose");

const MongoURI = "Mongo URI";

const MongoServer = async () => {
  try {
    await mongoose.connect(MongoURI, {
      useNewUrlParser: true,
    });
    console.log("Connected to MongoDB !!");
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

const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("User", UserSchema);
```

## 6. User Signup

포스트맨을 이용할 때 'Headers' 탭에서 'KEY: Content-Type'를 'VALUE: application/json' 로 바꾸어준다.

```js
// routes/user.js

const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../model/User");

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post(
  "/signup",
  [
    check("username", "유효한 username을 입력해주세요.").not().isEmpty(),
    check("email", "유효한 email을 입력해주세요.").isEmail(),
    check("password", "유효한 password를 입력해주세요.").isLength({ min: 6 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { username, email, password } = req.body;

    try {
      let user = await User.findOne({
        email,
      });
      if (user) {
        return res.status(400).json({
          msg: "유저가 이미 존재합니다.",
        });
      }

      user = new User({
        username,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, "secret", { expiresIn: 10000 }, (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
        });
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("데이터를 저장하는데 에러가 생겼습니다.");
    }
  }
);

module.exports = router;
```

```js
// index.js

const express = require("express");
const MongoServer = require("./config/db");
const bodyParser = require("body-parser"); // 새로 추가
const user = require("./routes/user"); // 새로 추가

// 몽고 서버 시작
MongoServer();

const app = express();

// 포트
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "API working" });
});

/**
 * Router Middleware
 * Router - /user/*
 * Method - *
 */
app.use("/user", user); // 새로 추가

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
```

## 7. User Login

```js
// routes/user.js

router.post(
  "/login",
  [
    check("email", "유효한 eamil을 입력해주세요.").isEmail(),
    check("password", "유효한 비밀번호를 입력해주세요.").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const erros = validationResult(req);

    if (!erros.isEmpty()) {
      return res.status(400).json({
        erros: erros.array(),
      });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({
          message: "유저가 존재하지 않습니다.",
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "비밀번호가 일치하지 않습니다!",
        });

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, "secret", { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "서버 에러",
      });
    }
  }
);
```

## 8. 토큰을 이용해 로그인된 User 정보 가져오기

### auth

헤더의 토큰을 통과하면 user를 리턴해준다.

```js
// routes/user.js

const auth = require("../middleware/auth");

/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /user/me
 */

router.get("/me", auth, async (req, res) => {
  try {
    // 미들웨어애서 토큰 인증을 하면 req.user를 가져올수있다.
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({ message: "유저정보를 가져오는데 실패했습니다." });
  }
});
```

findByID vs findOne<br>

findById는 findOne보다 좀 더 편리한 함수이다.<br>
[예제소스](https://github.com/Automattic/mongoose/blob/8cb0e355f75140bd4506a80b21dd94244f828cb0/lib/model.js#L1067-L1069)

```js
Model.findById = function findById(id, fields, options, callback) {
  return this.findOne({ _id: id }, fields, options, callback);
};
```

### 미들웨어

auth 미들웨어는 토큰을 검증하고, 토큰 payload에 기반한 user를 찾고 가져온다.

```js
// middleware/auth.js

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).json({ message: "인증 에러" });

  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "유효하지않는 토큰입니다." });
  }
};
```

## 테스트

포스트맨(GET 요청)
`localhost:3000/user/me`
회원가입 후 로그인을 통해 토큰을 얻은 후 토큰을 복사해 Header에 넣어준다. (KEY: token, VALUE: 얻은 토큰)
