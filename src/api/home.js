import request from "./request";
// 首页获取实例
export const getInstanceList = (num) => {
  let url = '/home/instance';
  if(num){
    url+='?num='+num;
  }
  return  request({
      url: url,
      method: 'GET'
  });
}