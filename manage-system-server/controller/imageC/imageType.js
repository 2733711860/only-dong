/*
* 获取图片分类
* */
const { imageType } = require('../../utils/paramEscape');

module.exports = {
  async imageClassify(ctx, next) {
    try {
      let classifyList = [];
      await Object.keys(imageType).forEach((key) => {
        let item = {
          value: key,
          text: imageType[key]
        };
        classifyList.push(item);
      });
      ctx.body = {
        code: 200,
        msg: '图片分类信息获取成功！',
        data: {
          classifyList
        }
      }
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: '服务器异常！'
      }
    }
  }
};
