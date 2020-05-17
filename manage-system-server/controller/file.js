const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const app = new Koa();
const getUploadFileExt = require('../utils/getUploadFileExt');
const getUploadFileName = require('../utils/getUploadFileName');
const checkDirExist = require('../utils/checkDirExist');
const getUploadDirName = require('../utils/getUploadDirName');
const {listenHost, listenPort} = require('../config.js');
const { addData, findData, editData } = require('../mysql/mysql');
const {check_token_code, create_token} = require('../utils/token');

module.exports = {
  // 文件上传
  async upload(ctx, next) {
    try {
      const file = ctx.request.files.file;
      const name = file.name;
      const reader = fs.createReadStream(file.path); // 创建可读流
      const ext = getUploadFileExt(file.name); // 获取文件后缀
      const dirName = await getUploadDirName(); // 最终要保存到的文件夹目录
      const dir = path.join(__dirname, `../public/upload/${dirName}`);
      checkDirExist(dir); // 检查文件夹是否存在如果不存在则新建文件夹
      const fileName = getUploadFileName(ext); // 获取文件名称
      file.path = `${dir}/${fileName}`; // 重新覆盖 file.path 属性
      app.context.uploadpath = app.context.uploadpath ? app.context.uploadpath : {};
      app.context.uploadpath[name] = `${dirName}/${fileName}`;
      const upStream = fs.createWriteStream(file.path); // 创建可写流
      let avatar = new Promise((resolve, reject) => {
        var stream = reader.pipe(upStream);
        stream.on('finish', function () {
          resolve(`http://${listenHost}:${listenPort}/upload/${dirName}/${fileName}`);
        });
      });
      avatar = await avatar;
      let userId = ctx.request.body.userId;
      let token = await create_token(ctx.request.body.userId);
      let editSql = `update user set avatar = '${avatar}', token = '${token}' where userId = '${userId}'`;
      await editData(editSql).then(data => {
        ctx.body = {
          code: 200,
          msg: '用户头像上传成功！',
          data: {
            avatar
          }
        }
      }, err => {
        console.log(err)
        ctx.body = {
          code: 500,
          msg: '服务器异常，用户头像上传失败！'
        }
      });
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: '服务器异常，用户头像上传失败！'
      }
    }
  }
};