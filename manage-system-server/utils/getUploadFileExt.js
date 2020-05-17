function getUploadFileExt(name) { // 获取文件后缀
  let ext = name.split('.');
  return ext[ext.length - 1];
}

module.exports = getUploadFileExt;