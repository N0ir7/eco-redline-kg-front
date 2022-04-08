<template>
  <div class="home">
    <div class="instance-header">
      --实例展示--
    </div>
      <div class="card-preview">
        <ul class="card-wrapper">
          <li class="card card-li-4" v-for="(ins) in instanceList" :key="ins.id">
            <a @click="goDetail(ins.id)">
              <div class="img" :style="{'background-image':`url(${ins.imgUrl})` }"></div>
              <div class="title" :title="ins.name">{{ins.name}}</div>
              <div class="desc" :title="ins.description">{{ins.description}}</div>
            </a>
          </li>
        </ul>
      </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data(){
    return{
    }
  },
  computed:{
    ...mapGetters('home',['instanceList']),
  },
  mounted(){
  },
  methods:{
    goDetail(id){
      this.$router.push({path:'/detail',query:{instanceId:id}});
    },
  }
}
</script>

<style lang="scss" scoped>
.home{
  .instance-header{
    color:#999;
    padding: 30px 0;
    font-size: 30px;
  }
  ul,li{
    list-style: none;
    padding: 0;
    margin: 0;
  }
  ul{
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }
  .card-preview{
    padding-bottom: 32px;
    margin: 0 auto;
    -webkit-animation: appear .3s;
    animation: appear .3s;
    .card-wrapper{
      display: flex;
      .card{
        flex: 1;
        max-width: calc(25% - 24px);
        margin-right: 32px;
        font-size: 14px;
        background-color: #fff;
        cursor: pointer;
        transition: all .3s;
        box-shadow: 0 8px 20px 0 hsl(0deg 0% 88% / 50%);
        border-radius: 4px;
        overflow: hidden;
        &:hover{
          transform: translateY(-5px);
          box-shadow: 0 14px 20px 0 hsl(0deg 0% 78% / 80%); 
        }
        .img{
          position: relative;
          // height: 56.25%;
          padding-top: 56.25%;
          margin-bottom: 16px;
          background: no-repeat 50%;
          background-size: cover;
          background-color: #f1f2f7;
          border-radius: 2px;
        }
        .title{
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
        .desc{
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
      .card-li-4{
        width: calc(33.33333% - 23.33333px);
      }
    }
  }
  
}

@keyframes glow-in {
  from {
    opacity: 0;
  }
  65% {
    opacity: 1;
    text-shadow: 0 0 25px white;
  }
  75% {
    opacity: 1;
  }
  to {
    opacity: 0.7;
  }
}
</style>