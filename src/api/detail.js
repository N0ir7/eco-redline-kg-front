import request from "./request";

export const getGraphByInId = (id) => {
  let url = '/detail/getGraph';
  if(id){ // 如果带了inId则加上该参数
    url+='?inId='+id;
  }
  return  request({
      url: url,
      method: 'GET'
  });
}

export const getGraphByNodeId = (id) => {
  let url = '/detail/getGraph';
  if(id){ // 如果带了nodeId则加上该参数
    url+='?nodeId='+id;
  }
  return  request({
      url: url,
      method: 'GET'
  });
}