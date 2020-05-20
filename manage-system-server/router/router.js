const router = require('koa-router')();
const controller = require('../controller/index');

router.get('/', async (ctx, next) => {
  ctx.body = "hello world! create by pawn! my blog => http://blog.lcylove.cn"
})

.get('/api/other/getCheckCode', controller.other.getCheckCode) // 获取验证码
.post('/api/user/register', controller.user.register) // 用户注册
.post('/api/user/improve', controller.user.improve) // 用户信息完善
.post('/api/user/login', controller.user.login) // 用户登陆
.post('/api/file/upload', controller.user.upload) // 头像上传
.post('/api/file/image/upload', controller.image.imageUpload) // 图片上传
.post('/api/file/image/getClassify', controller.image.imageClassify) // 图片分类
.post('/api/image/search', controller.image.search) // 图片查询

module.exports = router;