module.exports = {
  sqlCongif: {
    host: 'localhost',
    user: 'root',
    port: '3306',
    database: 'dong',
    password: '123456',
    connectionLimit: 50 // 最大连接数
  },
  listenPort: 3000,
  listenHost: 'localhost',
  // 用户密码加密字符串
  PWD_ENCODE_STR: "pawn_user_encode_str",
  // token 加密字符串,撒盐：加密的时候混淆
  TOKEN_ENCODE_STR: "pawn_token_encode_str",
  // 添加非get请求通过的连接：用户登陆及注册接口还有get类型接口不需要进行token有效性验证
  URL_YES_PASS: ['/api/user/login', '/api/user/register', '/api/other/getCheckCode']
};