const CityList = require('../db/db').City;

// 获取城市列表，并封装成树形图结构
module.exports = {

  async getCity(ctx, next) { // 转为vant组件库（vue）封装的接口数据
    try {
      // 省
      let province_list = await CityList.find({levelType: '1'});
      province_list = await getList(province_list);

      // 市
      let city_list = await CityList.find({levelType: '2'});
      city_list = await getList(city_list);

      // 区
      let county_list = await CityList.find({levelType: '3'});
      county_list = await getList(county_list);

      let address = {
        province_list,
        city_list,
        county_list
      }

      if (province_list.length == 0 || city_list.length == 0 ||county_list.length == 0) {
        ctx.body = {
          code: 401,
          msg: '地址获取失败！'
        }
        return ;
      }

      ctx.body = {
        code: 200,
        msg: '地址获取成功！',
        data: {
          address
        }
      }

    } catch (e) {
      console.log(e)
      ctx.body = {
        code: 500,
        msg: '服务器异常，请稍后再试！'
      }
    }
  }
}



function getList(list) {
  let one = {};
  list.forEach((obj) => {
    let keyOne = obj.cityCodee;
    one[keyOne] = obj.cityName;
  })
  return one;
}
