<template>
  <div class="detail">
      <div class="graph-panel">
        <graph :graph = "graph" :centerId="centerId" :canExpand="expand"/>
        <detail-panel/>
      </div>
  </div>
</template>

<script>
import nProgress from "nprogress";
import "nprogress/nprogress.css"
import Graph from "@/components/KnowledgeGraph"
import DetailPanel from'@/components/DetailPanel'
import {getGraphByInId,getGraphByNodeId} from '@/api/detail'
export default {
  components:{
    Graph,
    DetailPanel
  },
  data(){
    return{
      graph:null,
      error:null,
      centerId:null,
      expand:false
    }
  },
  methods: {
    fetchGraph(params){
      let inId = params.instanceId;
      let nId = params.nodeId;
      if(inId){
        getGraphByInId(inId).then(res=>{
          if(res.data){
            this.graph = res.data.data;
            this.centerId = inId;
            this.expand = false;
          }
        }).catch(error=>console.log(error));
      }else if(nId){
        getGraphByNodeId(nId).then(res=>{
          if(res.data){
            this.graph = res.data.data;
            this.centerId = nId;
            this.expand = true;
          }
        }).catch(error=>{
          console.log(error);
        });
      }
    }
  },
  async beforeRouteEnter(to, from, next) {
    nProgress.start();
    await fetchGraph(to.query, (err, data,id,expand) => {
      next(vm => {
        vm.$set(vm.$data,'graph',data)
        vm.$set(vm.$data,'error',err)
        vm.$set(vm.$data,'centerId',id)
        vm.$set(vm.$data,'expand',expand)
        nProgress.done();
      })
    })
    function fetchGraph(params,setFun){
      let inId = params.instanceId;
      let nId = params.nodeId;
      if(inId){
        getGraphByInId(inId).then(res=>{
          if(res.data){
            if(setFun){
              setFun(null,res.data.data,inId,false)
            }
          }
        }).catch(error=>console.log(error));
      }else if(nId){
        getGraphByNodeId(nId).then(res=>{
          if(res.data){
            if(setFun){
              setFun(null,res.data.data,nId,true)
            }
          }
        }).catch(error=>{
          if(setFun){
            setFun(error,null,null,null);
          }
          console.log(error);
        });
      }
    }
  },
  // 路由改变前，组件就已经渲染完了
  // 逻辑稍稍不同
  async beforeRouteUpdate(to) {
    this.graph = {}
    try {

      nProgress.start();
      this.graph = await this.fetchGraph(to.query)
      nProgress.done();
    } catch (error) {
      this.error = error.toString()
    }
  },
  created(){

  },
  mounted(){
  }
}
</script>

<style lang = "scss" scoped>
.detail{
  margin: 0;
  .title{
    font-size: 20px;
  }
  .graph-panel{
    display: flex;
  }
}
</style>