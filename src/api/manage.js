import request from "./request";
// 管理页面获取实例列表
export const getInstanceList = (pageNo,pageSize,name) => {
  let url = '/manage/getInstance';
  return  request({
      url: url,
      method: 'GET',
      params:{
        pageNo,pageSize,name // 空的参数会自动忽略掉
      }
  });
}
// 管理页面获取节点列表
export const getNodeList = (pageNo,pageSize,name) => {
  let url = '/manage/getNodes';
  return  request({
      url: url,
      method: 'GET',
      params:{
        pageNo,pageSize,name // 空的参数会自动忽略掉
      }
  });
}