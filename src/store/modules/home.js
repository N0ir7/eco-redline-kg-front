import {getInstanceList} from '@/api/home.js'

const state={
  instanceListData:[]
}
const mutations={
  GET_INSTANCE_LIST:(state,list)=>{
    state.instanceListData = list||[];
  }
}
const actions={
  async getInstanceList({commit},num){
    let list
    if(num){
      list = await getInstanceList(num);
    }else{
      list = await getInstanceList();
    }
    // console.log('list',list);
    if(list.data){
      commit('GET_INSTANCE_LIST',list.data);
    }
  }
}
const getters= {
  instanceList(state){
    return state.instanceListData.data;
  }
}

export default{
  namespaced:true,
  state,
  mutations,
  actions,
  getters
}