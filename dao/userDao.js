const mysql = require('mysql');
const conf = require('../bin/db/conf/db');
const sql = require('./userSqlMapping');
const logger = require('../common/logger');
// 使用连接池，提升性能
const pool = mysql.createPool(conf);
const common = require('./common');

module.exports = {
  add(req, res, next) {
    pool.getConnection((err, connection) => {
      if (err) {
        logger.error(err);
        return;
      }
      const param = req.body.params;
      // 建立连接，向表中插入值
      connection.query(sql.insert, [param.uid, param.name, param.password, param.role, param.sex], (err, result) => {
        if (err) {
          logger.error(err);
        } else {
          result = {
            code: 0,
            msg: '增加成功',
          };
        }
        // 以json形式，把操作结果返回给前台页面
        common.jsonWrite(res, result);
        // 释放连接
        connection.release();
      });
    });
  },
  delete(req, res, next) {
    // delete by Id
    pool.getConnection((err, connection) => {
      if (err) {
        logger.error(err);
      }
      const uid = req.query.uid.toString();
      connection.query(sql.delete, uid, (err, result) => {
        if (err) {
          logger.error(err);
        } else {
          result = {
            code: 0,
            msg: '删除成功',
          };
        }
        common.jsonWrite(res, result);
        connection.release();
      });
    });
  },
  update(req, res, next) {
    // update by id
    // 为了简单，要求同时传name和age两个参数
    const param = req.body;
    pool.getConnection((err, connection) => {
      if (err) {
        logger.error(err);
      }
      connection.query(sql.update, [param.name, param.sex, param.password, param.uid], (err, result) => {
        if (err) {
          logger.error(err);
        } else {
          result = {
            code: 0,
            msg: '增加成功',
          };
        }
        // 以json形式，把操作结果返回给前台页面
        common.jsonWrite(res, result);
        connection.release();
      });
    });
  },
  queryById(req, res, next) {
    console.log('🐶🐶🐶🐶🐶', req.query.uid);
    const { uid } = req.query; // 为了拼凑正确的sql语句，这里要转下整数
    pool.getConnection((err, connection) => {
      if (err) {
        logger.error(err);
      }
      connection.query(sql.queryById, uid, (err, result) => {
        let ret;
        if (err) {
          logger.error(err);
        } else {
          ret = {
            code: 0,
            data: result,
          };
        }
        common.jsonWrite(res, ret);
        connection.release();
      });
    });
  },
  queryAll(req, res, next) {
    pool.getConnection((err, connection) => {
      if (err) {
        logger.error(err);
      }
      // console.log(req.user.uid);
      connection.query(sql.queryAll, (err, result) => {
        let ret;
        if (err) {
          logger.error(err);
        } else {
          ret = {
            code: 0,
            data: result,
          };
        }
        common.jsonWrite(res, ret);
        connection.release();
      });
    });
  },
};
