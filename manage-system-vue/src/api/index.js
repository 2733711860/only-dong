/**
 * Created by chenyb on 22/10/18.
 * API命名配置列表
 * 命名规则：驼峰式命名方式，动词放前面，名词放后面，
 * 如:addFeatures
 * API命名变量不要太过长
 */
import config from '../config'
let baseUrl
switch (process.env.NODE_ENV) {
  // 生产环境
  case 'production':
    baseUrl = config.baseUrl.pro
    break
  // 预生产环境
  case 'testing':
    baseUrl = config.baseUrl.tes
    break
  default:
    // 开发环境或测试环境
    baseUrl = config.baseUrl.dev
    break
}
export { baseUrl }
export default {
  // **系统管理**开始
  login: baseUrl + '/api/user/login', // 用户登陆
  getCheckCode: baseUrl + '/api/other/getCheckCode', // 获取验证码
  register: baseUrl + '/api/user/register', // 注册
  improve: baseUrl + '/api/user/improve', // 用户信息完善
  upload: baseUrl + '/api/file/upload', // 头像上传接口
  imageUpload: baseUrl + '/api/file/image/upload', // 图片上传
  getClassify: baseUrl + '/api/file/image/getClassify', // 获取图片分类
  search: baseUrl + '/api/image/search', // 图片查询
  getWordImage: baseUrl + '/api/getWordImage',
}
