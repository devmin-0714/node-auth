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

      jwt.sign(payload, "randommString", { expiresIn: 10000 }, (err, token) => {
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

      jwt.sign(payload, "randomString", { expiresIn: 3600 }, (err, token) => {
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

module.exports = router;
