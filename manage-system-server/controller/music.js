/*
*
* 音乐相关操作
*/

const music = require('../db/db').Music;
const uuidv1 = require('uuid/v1');

module.exports = {

  /*
  * 获取音乐列表
  * @param: size => 每页个数 默认：10
  * @param: nowPage => 当前页数 默认：1
  */
  async getMusic(ctx, next) {
    try {
      let {
        size = 10,
        nowPage = 1
      } = ctx.request.body.pageMsg;

      // skip跳过多少个，然后limit取到多少个
      let options = {
        skip: Number((nowPage-1) * size),
        limit: Number(size),
        sort: {'create_time': '-1'}
      };

      // 查询
      let res = await music.find({}, null, options); // 查询条件、想要查询的字段、options
      // 获取总共有多少条数据
      let total = await music.countDocuments();

      ctx.body = {
        code: 200,
        msg: '获取成功！',
        data: {
          musicList: res,
          pagination: {
            total,
            nowPage: Number(nowPage),
            size: Number(size)
          }
        }
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        code: 500,
        msg: '服务器异常！'
      }
    }
  },

  /*
  *
  * 添加音乐
  */
  async addMusic(ctx, next) {
    try {
      let {
        music_name = '',
        music_lyric = '',
        music_url = '',
        music_picture = '',
        music_singer = '',
        music_singer_picture = ''
      } = ctx.request.body;

      if (music_name == '' || music_lyric == '' || music_picture == '' || music_singer == '' || music_singer_picture == '') {
        ctx.body = {
          code: 401,
          msg: '请上传相关音乐信息！'
        };
        return ;
      }

      let music_id = uuidv1(); // 随机获取一个music_id

      // 保存
      let newMusic = new music({
        music_id, music_name, music_lyric, music_picture, music_singer, music_singer_picture, music_url
      });
      let res = await newMusic.save();

      if (!res._id) {
        ctx.body = {
          code: 500,
          msg: '添加音乐失败，服务器异常，请稍后再试!'
        }
        return ;
      }
      ctx.body = {
        code: 200,
        msg: '添加成功！'
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        code: 500,
        msg: '服务器异常！'
      }
    }
  },

  /*
  *
  * 删除音乐
  */
  async deleteMusic(ctx, next) {
    try {
      let {music_id='', music_name=''} = ctx.request.body;

      // 查询并删除
      let res = await music.findOneAndDelete({music_id, music_name});

      if (!res) {
        ctx.body = {
          code: 500,
          msg: '删除失败，服务器异常，请稍后再试!'
        }
        return ;
      }
      ctx.body = {
        code: 200,
        msg: '删除成功！'
      }
    } catch (e) {
      console.log(e)
      ctx.body = {
        code: 500,
        msg: '服务器异常！'
      }
    }
  }
}