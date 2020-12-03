const express = require('express');
const md5 = require('blueimp-md5');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const checkOutToken = require('../util/checkToken');

const router = express.Router();

router.use(checkOutToken);
router.post('/api/login', (req, res, next) => {
  const { name, password } = req.body.params;
  console.log('res.decoded🐻🐻🐻🐻', res.decoded);
  if (res.decoded) {
    res.send({ status: 200, msg: '登陆成功' });
  } else if (name && password) {
      const querySql = 'SELECT * FROM t_user where name=?';
      res.locals.connection.query(querySql, [name], (err, results, fields) => {
        if (err) {
          res.send({ status: 500, msg: '异常错误' });
        } else if (results && results.length > 0) {
          if (password === results[0].password) {
            const cert = fs.readFileSync(path.resolve(__dirname, '../rsa/jwt.pem'));
            const token = jwt.sign({
              uid: results[0].uid,
              name: results[0].name,
          }, cert, {
              algorithm: 'RS256',
              expiresIn: '1h',
          }, () => console.log('生成token'));
          // jsonwebtoken 详情参考官网https://github.com/auth0/node-jsonwebtoken
            res.send({ status: 200, msg: '登陆成功', token });
          } else {
            res.send({ status: 200, msg: '密码不正确' });
          }
        } else {
          res.send({ status: 200, msg: '用户不存在' });
        }
        });
    }
});

router.post('/api/adduser', (req, res) => {
  const {
    uid,
    name,
    password,
    role = null,
    sex = 0,
  } = req.body.params;
  console.log(req);
  const addSql = 'INSERT INTO t_user(uid,name,password,role,sex) VALUES(?,?,?,?,?)';
  const querySql = 'SELECT * FROM t_user WHERE uid=?';
  res.locals.connection.query(querySql, [uid], (error, results, fields) => {
    if (error) {
      res.send(JSON.stringify({
        'status': 500,
        'error': error,
        'response': null,
      }));
    } else if (results.length > 0) {
      res.send({ status: 200, msg: '用户已存在' });
      } else {
        // const secPassword = bcrypt.hashSync(password, 10);
        const { connection } = res.locals;
        connection.query(addSql, [uid, name, md5(password, 'jlgexpress'), role, sex], (err, results, fields) => {
          if (err) {
            res.send(JSON.stringify({
              'status': 500,
              'error': err,
              'response': null,
            }));
          } else {
            res.send({
              msg: '添加成功',
              'status': 200,
            });
          }
        });
      }
  });
});

router.post('/api/deleteuser', (req, res) => {
  const {
    uid,
  } = req.body.params;
  console.log('🐶🐶🐶🐶🐶🐶🐶🐶', req);
  console.log('🐶🐶🐶🐶🐶🐶🐶🐶', uid);
  res.send({ status: 200, response: { name: 'jlg' } });
  // res.locals.connection.query(`DELETE from t_user where uid=${uid}`, (error, results, fields) => {
  //   if (error) {
  //     res.send(JSON.stringify({
  //       'status': 500,
  //       'error': error,
  //       'response': null,
  //     }));
  //   } else {
  //     // res.send(JSON.stringify({ 'status': 200, 'error': null, 'response': results }));
  //     console.log(results);
  //     res.send({
  //       msg: '删除成功',
  //       'status': 200,
  //     });
  //   }
  // });
});
router.post('/api/updateuser', (req, res) => {
  const {
    uid,
  } = req.body.params;
  res.locals.connection.query(`UPDATE t_user SET name=? WHERE uid=${uid}`, ['buzhidao'], (error, results, fields) => {
    if (error) {
      res.send(JSON.stringify({
        'status': 500,
        'error': error,
        'response': null,
      }));
    } else {
      // res.send(JSON.stringify({ 'status': 200, 'error': null, 'response': results }));
      res.send({
        msg: '更新成功',
      });
    }
  });
});

router.get('/api/searchuser', (req, res) => {
  const {
    uid,
  } = req.query;
  res.locals.connection.query(`SELECT * FROM t_user where uid=${uid}`, (error, results, fields) => {
    if (error) {
      res.send(JSON.stringify({
        'status': 500,
        'error': error,
        'response': null,
      }));
    } else {
      res.send(JSON.stringify({
        'status': 200,
        'error': null,
        'response': results,
      }));
    }
  });
});

module.exports = router;
