const Mysql = require('mysql'),
  { sqlCongif } = require('../config');

// 创建数据库连接
const pool = Mysql.createPool(sqlCongif);

/*
* 通过connection的query方法统一执行增删改查的操作
* funcName 为增删改查方法的函数名
* statements 进行增删改查操作的条件，查询条件都由前端访问时将条件传入
* parameter 进行添加或修改的数据
*/
function poolFn(funcName, statements, parameter) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => { // 建立连接池
      if (err) {
        throw err;
        reject('建立连接池失败');
        return;
      }

      funcName(connection, statements, parameter).then(data => {
        connection.release(); // 释放连接
        resolve(data);
      })
    })
    // console.log('连接池里的连接数:' + pool._allConnections.length); // 连接池里的连接数
  })
}

/*
* 查询数据
* connection 连接句柄
* statements 查询语句
*/
function connecQueryFind(connection, statements, parameter) {
  return new Promise((resolve, reject) => {
    connection.query(statements, parameter, (err, result) => {
      if (err) {
        throw err;
        reject('查询失败');
        return;
      }
      resolve(result);
    })
  })
}

// 添加数据
function connecQueryAdd(connection, statements, parameter) {
  return new Promise((resolve, reject) => {
    connection.query(statements, parameter, (err, result) => {
      if(err) {
        throw err;
        reject('添加失败');
      }
      resolve(result);
    });
  })
}

// 删除数据
function connecQueryDele(connection, statements) {
  return new Promise((resolve, reject) => {
    connection.query(statements, (err, result) => {
      if(err) {
        throw err;
        reject('删除失败');
      }
      resolve(result);
    });
  })
}

// 修改数据
function connecQueryExit(connection, statements, parameter) {
  return new Promise((resolve, reject) => {
    connection.query(statements, parameter, (err, result) => {
      if(err) {
        throw err;
        reject('修改失败');
      }
      resolve(result);
    });
  })
}

// 将方法统一封装
function queryFn(funcName, statements, parameter) {
  return new Promise((resolve) => {
    poolFn(funcName, statements, parameter).then(data => {
      resolve(data);
    });
  });
}

module.exports = {
  findData(statements, parameter) {
    return queryFn(connecQueryFind, statements, parameter);
  },
  addData(statements, parameter) {
    return queryFn(connecQueryAdd, statements, parameter);
  },
  deleData(statements, parameter) {
    return queryFn(connecQueryDele, statements, parameter);
  },
  editData(statements, parameter) {
    return queryFn(connecQueryExit, statements, parameter);
  }
};






