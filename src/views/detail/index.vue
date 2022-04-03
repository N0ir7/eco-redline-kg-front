<template>
  <div class="detail">
    <div class="title">
      this is detail page!
    </div>
      <div class="graph-panel">
        <graph :graph = 'graph'/>
        <detail-panel/>
      </div>
  </div>
</template>

<script>

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
      graph:{}
    }
  },
  methods: {
    fetchGraph(){
      let inId = this.$route.query.instanceId;
      let nId = this.$route.query.nodeId;
      console.log('inId',inId);
      console.log('nId',nId);
      if(inId){
        // this.$store.dispatch('detail/getGraphDataByInId',inId)
        getGraphByInId(inId).then(res=>{
          console.log('graph',res.data);
          if(res.data){
            this.graph = JSON.parse(res.data.data);
          }
        }).catch(error=>console.log(error));
      }else if(nId){
        // this.$store.dispatch('detail/getGraphDataByNodeId',nId)
        getGraphByNodeId(nId);
      }
    }
  },
  computed:{
  },
  watch:{
    'this.$route.params' : {
        handler:'fetchGraph',
        immediate:true
      }
  },
  mounted(){
    console.log('graph',this.graph);
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