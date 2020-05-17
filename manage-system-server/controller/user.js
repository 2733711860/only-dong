/*
* 用户表进行操作
*
*/
const sha1 = require('sha1'); // 加密算法
const {check_token_code, create_token} = require('../utils/token');
const { PWD_ENCODE_STR} = require('../config');
const { addData, findData, editData } = require('../mysql/mysql');
const xss = require('xss'); // 安全，XSS过滤器可以从输入值中删除html标记
const saveImage = require('./file')

module.exports =  {
  //用户注册
  async register(ctx, next) {
    let {
      userName = '',
      userId = '',
      password = '',
      re_password = '',
      avatar = '',
      checkCode = '',
      code_token = ''
    } = ctx.request.body;

    try {
      if (userId == '' || password == '') {
        ctx.body = {
          code: 401,
          msg: '注册失败，请填写完整信息！'
        };
        return ;
      }
      if (password.length < 6) {
        ctx.body = {
          code: 401,
          msg: '注册失败，密码最少为6位！'
        };
        return;
      }
      if (password != re_password) {
        ctx.body = {
          code: 401,
          msg: '注册失败，2次密码输入不一致！'
        };
        return;
      }
      // 验证码判断
      let checkcoderesult = await check_token_code({token: code_token, code: checkCode});
      if (!checkcoderesult) {
        ctx.body = {
          code: 401,
          msg: '注册失败，验证码错误!'
        };
        return;
      }

      // 判断用户账户是否重复
      let searchSql = `select * from user where userId = "${userId}"`;
      let checkUserResult = await findData(searchSql);
      if (checkUserResult.length != 0) {
        ctx.body = {
          code: 409,
          msg: '注册失败，登录账号重复了，换一个吧！'
        };
        return;
      }

      // 用户密码加密
      password = sha1(sha1(password + PWD_ENCODE_STR));

      // 防止xss攻击， 转义
      userName = xss(userName);

      // 创建token
      let token = create_token(userId);
      let level = '0'; // 刚注册级别为0

      // 保存用户信息
      var user = {userName, userId, password, avatar, token, level};
      let insertSql = `insert into user set ?`;
      await addData(insertSql, user).then(data => {
        ctx.body = {
          code: 200,
          msg: "注册成功！",
          data: {
            userMsg: user
          }
        }
      }, (err) => {
        ctx.body = {
          code: 409,
          msg: "注册失败，服务器异常!"
        }
      });
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: '服务器异常，请稍后再试！'
      }
    }
  },

  // 用户信息完善
  async improve(ctx, next) {
    let {
      userName = '',
      userId = '',
      level = '',
      idCard = '',
      sex = '',
      age = '',
      birthday = '',
      mobilePhone = '',
      password = ''
    } = ctx.request.body;
    try {
      if (userName == '' || userId == '' || idCard == '' || sex == '' || age == '' || birthday == '' || mobilePhone == '') {
        ctx.body = {
          code: 401,
          msg: '用户信息保存失败，请输入完整用户信息！'
        };
        return ;
      }

      // 用户名及密码判断
      password = sha1(sha1(password + PWD_ENCODE_STR)); // 获取加密后的密码
      let token = create_token(userId); // 创建token
      let editSql = `update user set userName = ?, level = ?, idCard = ?, sex = ?, age = ?, birthday = ?, mobilePhone = ?, token = ? where userId = ? and password = ?`;
      let params = [userName, level, idCard, sex, age, birthday, mobilePhone, token, userId, password];
      await editData(editSql, params).then(data => {
        console.log(data);
        ctx.body = {
          code: 200,
          msg: '用户信息保存成功！'
        }
      }, err => {
        ctx.body = {
          code: 500,
          msg: '服务器异常，用户信息保存失败！'
        }
      });
    } catch (e) {
      console.log(e)
      ctx.body = {
        code: 500,
        msg: '服务器异常，用户信息保存失败！'
      }
    }
  },

  // 登陆接口
  async login(ctx, next) {
    let {userId = '', password = '', checkCode = '', code_token = ''} = ctx.request.body;
    try {
      if (userId == '' || password == '') {
        ctx.body = {
          code: 401,
          msg: '登录失败，请输入账户或密码！'
        };
        return ;
      }

      // 验证码判断
      let checkCoderesult = await check_token_code({token: code_token, code: checkCode});
      if (!checkCoderesult) {
        ctx.body = {
          code: 401,
          msg: '登录失败，验证码错误！'
        };
        return;
      }

      // 用户名及密码判断
      password = sha1(sha1(password + PWD_ENCODE_STR)); // 获取加密后的密码
      let searchSql = `select * from user where userId = "${userId}" and password = "${password}"`;
      let checkUserResult = await findData(searchSql);
      if (checkUserResult.length == 0) {
        ctx.body = {
          code: 401,
          msg: '登录失败，账户或密码错误！'
        };
        return ;
      }

      // 登陆成功后先创建token
      let token = create_token(userId);

      // 将token存入user表里
      checkUserResult[0].token = token;
      let editSql = `update user set token = "${token}" where userId = "${userId}"`;
      await editData(editSql).then(data => {
        ctx.body = {
          code: 200,
          msg: '登陆成功！',
          data: {
            userMsg: checkUserResult
          }
        }
      }, err => {
        ctx.body = {
          code: 500,
          msg: '登录失败，服务器异常！'
        }
      });
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: '登录失败，服务器异常！'
      }
    }
  }
}






