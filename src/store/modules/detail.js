import {getGraphByInId,getGraphByNodeId} from '@/api/detail'

const state={
  graphData:{}
}
const mutations={
  GET_GRAPH_DATA:(state,list)=>{
    state.graphData = list||{};
  }
}
const actions={
  async getGraphDataByInId({commit},id){
    let res;
    console.log('在请求')
      res = await getGraphByInId(id);
      console.log('请求完了捏')
    // console.log('list',list);
    if(res.data){
      commit('GET_GRAPH_DATA',res.data);
    }
  },
  async getGraphDataByNodeId({commit},id){
    let res;
      res = await getGraphByNodeId(id);
    if(res.data){
      commit('GET_GRAPH_DATA',res.data);
    }
  }
}
const getters= {
  graph(state){
    // console.log(state.graphData.data)
    console.log('在get')
    return state.graphData.data?JSON.parse(state.graphData.data):{};
  }
}

export default{
  namespaced:true,
  state,
  mutations,
  actions,
  getters
}