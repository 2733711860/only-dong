/*
* 图片上传
* */
const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const app = new Koa();
const getUploadFileExt = require('../../utils/getUploadFileExt');
const getUploadFileName = require('../../utils/getUploadFileName');
const checkDirExist = require('../../utils/checkDirExist');
const getUploadDirName = require('../../utils/getUploadDirName');
const {listenHost, listenPort} = require('../../config.js');
const { addData, findData, editData } = require('../../mysql/mysql');
const UUID = require('uuid');

module.exports = {
  // 文件上传
  async imageUpload(ctx, next) {
    try {
      let param = ctx.request.body;
      const file = ctx.request.files.file;
      const name = file.name;
      const reader = fs.createReadStream(file.path); // 创建可读流
      const ext = getUploadFileExt(file.name); // 获取文件后缀
      const dirName = await getUploadDirName(); // 最终要保存到的文件夹目录
      const dir = path.join(__dirname, `../../public/images/${dirName}`);
      checkDirExist(dir); // 检查文件夹是否存在如果不存在则新建文件夹
      const fileName = param.name=='' ? name : `${param.name}.${ext}`; // 获取文件名称
      file.path = `${dir}/${fileName}`; // 重新覆盖 file.path 属性
      app.context.uploadpath = app.context.uploadpath ? app.context.uploadpath : {};
      app.context.uploadpath[name] = `${dirName}/${fileName}`;
      const upStream = fs.createWriteStream(file.path); // 创建可写流
      let imageUrl = new Promise((resolve, reject) => {
        var stream = reader.pipe(upStream);
        stream.on('finish', function () {
          resolve(`http://${listenHost}:${listenPort}/images/${dirName}/${fileName}`);
        });
      });
      param.imageUrl = await imageUrl;
      param.id = await UUID.v1();
      let insertSql = `insert into images set ?`;
      await addData(insertSql, param).then(data => {
        ctx.body = {
          code: 200,
          msg: "图片上传成功！"
        }
      }, (err) => {
        ctx.body = {
          code: 401,
          msg: "图片上传失败!"
        }
      });
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: '服务器异常，图片上传失败！'
      }
    }
  }
};