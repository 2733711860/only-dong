/*
* 图片查询
* */
const { findData } = require('../../mysql/mysql');

module.exports = {
  async search(ctx, next) {
    try {
      let param = ctx.request.body;
      let term = 'where (';
      if (param.classify != '') {
        param.classify.forEach(item => {
          term = term + `classify = '${item}' or `
        })
      }
      term = term == 'where (' ? term.substring(0, term.length - 2) : (term.substring(0, term.length - 4) + ') and');
      Object.keys(param).forEach(key => {
        if (param[key] != '' && key != 'page' && key != 'pageSize' && key != 'classify') {
          term = term + ` ${key} REGEXP '${param[key]}' and`;
        }
      });
      term = term == 'where' ? '' : term.substring(0, term.length - 4);
      let s_sql = `select sql_calc_found_rows * from images ${term} limit ${(param.page-1) * (param.pageSize)}, ${param.pageSize}`;
      let result = await findData(s_sql);
      let total = await findData(`SELECT FOUND_ROWS() as total;`);
      ctx.body = {
        code: 200,
        msg: '查询成功！',
        data: {
          list: result,
          page: {
            page: param.page,
            pageSize: param.pageSize,
            total: total[0].total
          }
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
