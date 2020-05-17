function getUploadFileName(ext){ // 获取文件名称
  return `${Date.now()}${Number.parseInt(Math.random() * 10000)}.${ext}`;
}
module.exports = getUploadFileName; 