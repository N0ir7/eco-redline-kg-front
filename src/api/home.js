import request from "./request";
// 首页获取实例
export const getInstanceList = (num) => {
  let url = '/manage/getInstance';
  if(num){ // 获取的实例个数
    url+='?pageSize='+num;
  }
  return  request({
      url: url,
      method: 'GET'
  });
}