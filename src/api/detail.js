import request from "./request";

export const getGraphByInId = (id) => {
  let url = '/detail';
  if(id){
    url+='?inId='+id;
  }
  return  request({
      url: url,
      method: 'GET'
  });
}

export const getGraphByNodeId = (id) => {
  let url = '/detail';
  if(id){
    url+='?nodeId='+id;
  }
  return  request({
      url: url,
      method: 'GET'
  });
}