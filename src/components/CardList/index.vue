<template>
  <div class="card-preview" >
    <ul class="card-wrapper" >
      <li class="card card-li-4" v-for="ins in list" :key="ins.id">
        <a @click="goDetail(ins.id)">
          <div
            class="img"
            :style="{ 'background-image': `url(${ins.imgUrl})` }"
          ></div>
          <div class="title" :title="ins.title">{{ ins.name }}</div>
          <div class="desc" :title="ins.description">{{ ins.description }}</div>
        </a>
      </li>
    </ul>
    <p v-if="loading">加载中...</p>
    <p v-if="noMore">没有更多了</p>
  </div>
</template>

<script>
export default {
  name:'CardList',
  props:{
    list: Array, // 要渲染的列表数据
    loading: Boolean, // 是否正在加载中
    noMore: Boolean, // 是否数据全部加载
    idFun: Function // 用来取单行数据的id，因为数据可能是instance，也可能是node
    },
  data(){
    return{
      
    }
  },
  methods:{
    goDetail(id){
      this.$router.push({path:'/detail',query:this.idFun(id)}); // 跳转至详细页面
    },
  }
};
</script>

<style lang="scss" scoped>
.card-preview {
  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  ul {
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }
  padding-bottom: 32px;
  margin: 0 auto;
  -webkit-animation: appear 0.3s;
  animation: appear 0.3s;
  .card-wrapper {
    display: flex;
    flex-wrap: wrap;
    .card {
      flex: 1;
      max-width: calc(25% - 24px);
      margin-right: 32px;
      margin-bottom: 32px;
      font-size: 14px;
      background-color: #fff;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 8px 20px 0 hsl(0deg 0% 88% / 50%);
      border-radius: 4px;
      overflow: hidden;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 14px 20px 0 hsl(0deg 0% 78% / 80%);
      }
      .img {
        position: relative;
        // height: 56.25%;
        padding-top: 56.25%;
        margin-bottom: 16px;
        background: no-repeat 50%;
        background-size: cover;
        background-color: #f1f2f7;
        border-radius: 2px;
      }
      .title {
        line-height: 28px;
        font-size: 18px;
        margin: 0 16px 6px;
        color: #333;
        padding-left: 0;
        font-weight: 700;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        height: 28px;
      }
      .desc {
        font-size: 14px;
        line-height: 24px;
        color: #999;
        text-overflow: ellipsis;
        overflow: hidden;
        height: 70px;
        padding: 0 18px;
        text-align: start;
        margin-bottom: 18px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
    .card-li-4 {
      // width: 25%;
      flex-basis: calc(25% - 40px);
    }
  }
}
</style>