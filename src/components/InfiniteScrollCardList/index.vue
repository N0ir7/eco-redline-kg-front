<template>
  <div>
    <span>共{{toalNum}}条数据</span>
    <card-list class="card" :list="list" :loading="loading" :noMore="noMore" :idFun="idFun" v-infinite-scroll="load"
      infinite-scroll-disabled="disabled" infinite-scroll-distance="0"/>
  </div>
</template>

<script>
import CardList from '@/components/CardList'
export default {
  name:'InfiniteCardList',
  components:{
    CardList,
  },
  props:{
    fetchData: Function, // 获取数据的api函数
    dataFun: Function, // 从response数据中获取data的函数（可能是instance，可能是nodes）
    idFun: Function, // 从data中获取id的函数
    show: Boolean, // 当前是否需要被渲染
    name: String // 搜索的关键词
  },
  data(){
    return{
      list:[], // 存储数据
      pageNo:1, // 页号
      pageSize:8, // 页面大小
      toalNum:10000, // 数据总条数
      loading:false, // 是否正在加载
    }
  },
  computed:{
    noMore () { // 是否加载完全部数据
      return this.pageNo >= this.maxPage && !this.loading
    },
    disabled () { // 是否禁用下拉功能
      return this.loading || this.noMore ||!this.show
    },
    maxPage(){ // 最大页数
      return (this.toalNum-1)/this.pageSize +1
    }
  },
  mounted(){
  },
  methods:{
    load(){ // 页面下拉至底部时触发加载函数
      this.loading = true;
      this.fetchData(this.pageNo,this.pageSize,this.name).then(res=>{
        this.list.push(...this.dataFun(res));
        this.toalNum = res.data.data.totalNum;
        this.pageNo++;
        setTimeout(() => {
          this.loading = false;    
        }, 1000);
      })
    },
  },
  watch:{
    name:function(){ // 若更改了搜索关键词，则全部重新渲染
      this.list = [];
      this.pageNo = 1;
    }
  }
}
</script>

<style lang="scss" scoped>
  .card{
    overflow: auto;
    height: 70vh;
  }
</style>