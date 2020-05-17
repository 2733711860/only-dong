const jwt = require('jsonwebtoken');
const {TOKEN_ENCODE_STR, URL_YES_PASS} = require('../config');
const { deleData, findData } = require('../mysql/mysql');

module.exports = {

  // 生成登陆token
  create_token(str) {
    return jwt.sign({str}, TOKEN_ENCODE_STR, {expiresIn: '1h'});
  },

  // 根据token判断验证码code是否正确
  async check_token_code({token, code}) {
    try {
      // 验证码转大写
      code = code.toUpperCase();
      await jwt.verify(token, TOKEN_ENCODE_STR);
      // 读取数据库，删除验证码
      let searchSql = `select * from checkcode where token = "${token}" and code = "${code}"`;
      let res = await findData(searchSql);
      if (res.length && res.length > 0) {
        // 删除验证码
        let deleteSql = `delete from checkcode where token = "${token}" and code = "${code}"`;
        let deleteRes = await deleData(deleteSql);
        if (deleteRes) {
          return true
        } else {
          return false
        }
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  },

  /*
  * get 请求与设置的请求不拦截验证，其余均需登录
  * 验证token
  */
  async all_check_token(ctx, next) {

    try {
      let url = ctx.url;
      if (!URL_YES_PASS.includes(url)) { // ctx.method != 'GET' &&
        let token = ctx.get('Authorization');
        if (token == '') {
          ctx.body = {
            code: 111,
            msg: '您未登录，请登陆！'
          }
          return ;
        }

        // 验证token是否过期，如果过期，会报错，直接走catch
        let str = '';
        await jwt.verify(token, TOKEN_ENCODE_STR, (err, decoded) => {
          if (err) {
            ctx.body = {
              code: 111,
              msg: '登陆过期，请重新登陆！'
            };
            return ;
          }
          str = decoded.str;
          return;
        });

        // 验证user_id与token是否匹配
        let res = await User.find({user_id: str, token});
        if (res.length == 0) {
          ctx.body = {
            code: 111,
            msg: '登陆过期，请重新登陆！'
          }
          return ;
        }
      }
      await next();
    } catch (e) {
      console.log(e)
      ctx.body = {
        code: 500,
        msg: '服务器异常！'
      }
    }
  }
}
