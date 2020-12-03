// const mysql = require('mysql');

// const conf = require('../bin/db/conf/db');
// const fs = require('fs');
// const multiparty = require('multiparty');
// const async = require('async');
// const pool = mysql.createPool(conf);

// // 向前台返回JSON方法的简单封装
// eslint-disable-next-line func-names
const jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '1',
      msg: '操作失败',
    });
  } else {
    res.json(ret);
  }
};

// // const upload = function (path, req, res, next) {
// //   return new Promise((resolve, reject) => {
// //     // 解析一个文件上传
// //     const form = new multiparty.Form();
// //     // 设置编辑
// //     form.encoding = 'utf-8';
// //     // 设置文件存储路径
// //     form.uploadDir = path;
// //     // 设置单文件大小限制
// //     form.maxFilesSize = 2000 * 1024 * 1024;
// //     const textObj = {};
// //     const imgObj = {};
// //     form.parse(req, (err, fields, files) => {
// //       if (err) {
// //         console.log(err);
// //       }
// //       Object.keys(fields).forEach((name) => { // 文本
// //         textObj[name] = fields[name];
// //       });
// //       Object.keys(files).forEach((name) => {
// //         if (files[name] && files[name][0] && files[name][0].originalFilename) {
// //           imgObj[name] = files[name];
// //           let newPath = unescape(`${path}/${files[name][0].originalFilename}`);
// //           let num = 1;
// //           const suffix = newPath.split('.').pop();
// //           const lastIndex = newPath.lastIndexOf('.');
// //           const tmpname = newPath.substring(0, lastIndex);
// //           while (fs.existsSync(newPath)) {
// //             newPath = `${tmpname}_${num}.${suffix}`;
// //             num++;
// //           }
// //           fs.renameSync(files[name][0].path, newPath);
// //           imgObj[name][0].path = newPath;
// //         }
// //       });
// //       resolve([imgObj, textObj]);
// //     });
// //   });
// // };

// // 批量导入的事务处理
// // const execTrans = function (sql, sqlparamsEntities, callback) {
// //   pool.getConnection((err, connection) => {
// //     if (err) {
// //       return callback(err, null);
// //     }
// //     connection.beginTransaction((err) => {
// //       if (err) {
// //         return callback(err, null);
// //       }
// //       const funcAry = [];
// //       sqlparamsEntities.forEach((sqlParam) => {
// //         const temp = function (cb) {
// //           connection.query(sql, sqlParam, (tErr, rows, fields) => {
// //             if (tErr) {
// //               connection.rollback(() => {
// //                 throw tErr;
// //               });
// //             } else {
// //               return cb(null, 'ok');
// //             }
// //           });
// //         };
// //         funcAry.push(temp);
// //       });

// //       async.series(funcAry, (err, result) => {
// //         if (err) {
// //           connection.rollback((err) => {
// //             connection.release();
// //             return callback(err, null);
// //           });
// //         } else {
// //           connection.commit((err, info) => {
// //             if (err) {
// //               connection.rollback((err) => {
// //                 connection.release();
// //                 return callback(err, null);
// //               });
// //             } else {
// //               connection.release();
// //               return callback(null, info);
// //             }
// //           });
// //         }
// //       });
// //     });
// //   });
// // };

module.exports = {
  jsonWrite,
  // upload,
  // execTrans,
};
