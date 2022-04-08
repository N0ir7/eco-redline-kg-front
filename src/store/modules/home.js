import {getInstanceList} from '@/api/home.js'

const state={
  instanceInfo:{}
}
const mutations={
  GET_INSTANCE_LIST:(state,info)=>{
    state.instanceInfo = info.data||{};
  }
}
const actions={
  async getInstanceList({commit},num){
    let info
    if(num){
      info = await getInstanceList(num);
    }else{
      info = await getInstanceList();
    }
    if(info.data){
      commit('GET_INSTANCE_LIST',info.data);
    }
  }
}
const getters= {
  instanceList(state){
    return state.instanceInfo.instances||[];
  }
}

export default{
  namespaced:true,
  state,
  mutations,
  actions,
  getters
}