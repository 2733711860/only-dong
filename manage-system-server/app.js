const Koa = require('koa');
const Config = require('./config');
const koaBody = require('koa-body');
var cors = require('koa2-cors');
// const {all_check_token} = require('./utils/token');
const path = require('path');
const koa_static = require('koa-static');

const app = new Koa();

app.use(cors());

// const getUploadFileExt = require('./utils/getUploadFileExt');
// const getUploadFileName = require('./utils/getUploadFileName');
// const checkDirExist = require('./utils/checkDirExist');
// const getUploadDirName = require('./utils/getUploadDirName');
app.use(koaBody({
  multipart: true,
  // encoding: 'gzip',
  formidable: {
    // uploadDir: path.join(__dirname, 'public/upload'),
    keepExtensions: true,
    maxFieldsSize: 20 * 1024 * 1024,
    // onFileBegin: (name, file) => {
    //   // console.log(file);
    //   // 获取文件后缀
    //   const ext = getUploadFileExt(file.name);
    //   // 最终要保存到的文件夹目录
    //   const dirName = getUploadDirName();
    //   const dir = path.join(__dirname, `public/upload/${dirName}`);
    //   // 检查文件夹是否存在如果不存在则新建文件夹
    //   checkDirExist(dir);
    //   // 获取文件名称
    //   const fileName = getUploadFileName(ext);
    //   // 重新覆盖 file.path 属性
    //   file.path = `${dir}/${fileName}`;
    //   app.context.uploadpath = app.context.uploadpath ? app.context.uploadpath : {};
    //   app.context.uploadpath[name] = `${dirName}/${fileName}`;
    // },
  }
}));
app.use(koa_static("public")); // 指定 public文件托管

// 添加token 验证中间件
// app.use(all_check_token);


// 路由
const router =require('./router/router');

app.use(router.routes(), router.allowedMethods(), (err)=> {
  console.log(err)
});

app.listen(Config.listenPort, Config.listenHost,  () => {
  console.log(`http://${Config.listenHost}:${Config.listenPort}`)
});