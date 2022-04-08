<template>
<div>
  <div class="tab">
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="实例管理" name="instance" :lazy="true">
      <scroll-card-list :fetchData = "getInstanceList" :name = "searchName" :dataFun = "(res)=>res.data.data.instances" :idFun="(id)=>({instanceId:id})" :show="activeName==='instance'"/>
      </el-tab-pane>
    <el-tab-pane label="节点管理" name="node" :lazy="true">
      <scroll-card-list :fetchData = "getNodeList" :name = "searchName" :dataFun = "(res)=>res.data.data.nodes" :idFun="(id)=>({nodeId:id})" :show="activeName==='node'"/>
    </el-tab-pane>
  </el-tabs>
  </div>
  
</div>
</template>

<script>
import {getInstanceList,getNodeList} from'@/api/manage'
import ScrollCardList  from '@/components/InfiniteScrollCardList'
export default {
  components:{
    ScrollCardList
  },
  data(){
    return{
      activeName:'instance',
      searchName:null
    }
  },
  methods: {
    handleClick(){
    },
    getNodeList:getNodeList,
    getInstanceList:getInstanceList,
  },
  mounted(){
  },
  watch:{
    '$route.query':{
      handler:function(){
        if(this.$route.query.activeType==2){
          this.activeName = "node";
        }else{
          this.activeName = "instance"
        }
        if(this.$route.query.name){
          this.searchName = this.$route.query.name;
        }
      },
      immediate:true
    }
  }
}
</script>

<style lang='scss' scoped>
.tab{
  margin: 20px;
  
}
</style>