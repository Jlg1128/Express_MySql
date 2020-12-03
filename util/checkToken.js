const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

function checkOutToken(req, res, next) {
  if (req.headers.authorization) {
    const token = req.headers.authorization;
    console.log('是否过期🐭🐭🐭🐭🐭', req);
    const cert = fs.readFileSync(path.resolve(__dirname, '../rsa/jwt_pub.pem'));
    try {
      const decoded = jwt.verify(token, cert);
    //   {
    //     "iss": "John Wu JWT",   该JWT的签发者
    //     "iat": 1441593502,      在什么时候签发的
    //     "exp": 1441594722,      什么时候过期，这里是一个Unix时间戳
    //     "aud": "www.example.com", 接收该JWT的一方
    //     "sub": "jrocket@example.com",  该JWT所面向的用户
    //     "from_user": "B",       没用到
    //     "target_user": "A"      没用到
    // }
      const { exp } = decoded;
      // 判断是否过期
      if (exp <= Date.now().toString().slice(0, 10)) {
        next();
      } else {
        res.decoded = decoded;
        res.send({ status: 200, msg: '已经登录，不需要再次登录' });
      }
    } catch (e) {
      // res.status(401);
      // res.send({ status: 401, msg: '异常错误' });
      next();
    }
  } else {
    next();
  }
}

module.exports = checkOutToken;
