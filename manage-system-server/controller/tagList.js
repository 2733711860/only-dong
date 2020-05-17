const TagList = require('../db/db').TagList;
const uuidv1 = require('uuid/v1');

module.exports = {

  // 获取tagList接口
  async getTagList(ctx, next) {
    try {
      let getTagResult = await TagList.find({});
      if (getTagResult.length == 0) {
        ctx.body = {
          code: 401,
          msg: '没有查询到标签列表！'
        }
        return ;
      }
      ctx.body = {
        code: 200,
        msg: '查询成功！',
        data: {
          tagList: getTagResult
        }
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        code: 500,
        msg: '获取失败，服务器异常！'
      }
    }
  },

  // 新增tag接口
  async addTag(ctx, next) {
    try {
      let {tag_name = ''} = ctx.request.body;

      //查询数据库是否已经存在
      let findTagResult = await TagList.find({tag_name});
      if (findTagResult.length > 0) {
        ctx.body = {
          code: 401,
          msg: "添加失败，已经存在此标签!"
        }
        return ;
      }

      let tag_id = uuidv1(); // 随机获取tag_id

      // 保存tag信息
      let tag = new TagList({tag_id, tag_name});
      let saveTagResult = await tag.save();
      if (!saveTagResult._id) {
        ctx.body = {
          code: 500,
          msg: "添加失败，服务器异常!"
        }
        return ;
      }
      ctx.body = {
        code: 200,
        msg: "添加成功!"
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        code: 500,
        msg: "添加失败，服务器异常!"
      }
    }
  }



}