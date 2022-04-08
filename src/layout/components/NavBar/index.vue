<template>
  <div class="navbar-container">
    <div class="left-menu">
      <logo class="left-menu-item" />
      <!-- <transition name="title-fade"> -->
        <div class="title left-menu-item" :class="{hide:hideTitle}">
          <p class="main-title">生态红线知识图谱可视化共享系统</p>
          <p class="main-title-en">
            eco-redline-knowledgegraph-visualization-system
          </p>
        </div>
      <!-- </transition> -->

      <search class="left-menu-item" />
    </div>
    <div class="right-menu">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-nav"
        mode="horizontal"
        @select="handleSelect"
        active-text-color="#ffd04b"
        background-color="Transparent"
        text-color="#000"
      >
        <el-menu-item index="Home"
          ><template slot="title">
            <svg slot="title" class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-bianlidian2x"></use></svg
            >首页
          </template></el-menu-item
        >
        <el-menu-item index="Modeling">
          <template slot="title">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-zhangshengyunying2x"></use></svg
            >知识建模
          </template></el-menu-item
        >
        <el-menu-item index="Management"
          ><template slot="title"
            ><svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-wangzhanguanli2x"></use></svg
            >知识管理</template
          ></el-menu-item
        >
        <el-menu-item index="Detail" disabled
          ><template slot="title"
            ><svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-yunyingshaicha2x"></use></svg
            >知识共享</template
          ></el-menu-item
        >
        <el-menu-item index="Download"
          ><template slot="title"
            ><svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-kuaisushoukuan2x"></use></svg
            >资料共享</template
          ></el-menu-item
        >
      </el-menu>
    </div>
  </div>
</template>

<script>
import Logo from "@/components/Logo";
import Search from "@/components/Search";
export default {
  components: {
    Logo,
    Search,
  },
  data() {
    return {
      activeIndex: "Home", // 当前所在页面
      bgColor: "url(/images/1.jpg) no-repeat center center fixed",
      hideTitle: false, // 是否隐藏标题
    };
  },
  methods: {
    handleSelect(key) {
      // console.log(key, keyPath);
      if (this.$route.name !== key) { // 不允许多次点击同一个导航栏
        this.$router.push({ name: key }); // 跳转至指定页面
      }
    },
    onClickSearch() {
      this.hideTitle = !this.hideTitle;
    },
  },
  mounted() {
    this.$bus.$on("onClickSearch", this.onClickSearch); // 监测搜索栏传来的信号,以隐藏或显示标题
    // console.log(this.$route);
  },
  watch:{ // 时刻监视路由path来改变导航栏的的当前页面的显示
    '$route.name':function(newVal){
      // console.log(this.$route.name);
      this.activeIndex = newVal;
    }
  }
};
</script>

<style lang = 'scss' scoped>
.navbar-container {
  height: 100px;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: relative;
  top: 0;
  &:hover {
    background-color: #fffafa;
  }
  &:before {
    content: "";
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    backdrop-filter: blur(5px);
  }
  .left-menu {
    display: flex;
    align-items: center;
    .title {
      z-index: 1;
      overflow: hidden;
      transition: width 0.6s;
      white-space: nowrap;
      width: 400px;
      .main-title {
        font-size: 26px;
        font-weight: bold;
        color: #000;
        margin: 0;
      }
      .main-title-en {
        font-size: 16px;
        margin-top: 5px;
        margin-bottom: 0;
      }
    }
    .hide{
      width: 0;
    }
  }
  .right-menu {
    display: flex;
    justify-content: flex-end;
    flex-wrap: nowrap;
    align-items: center;
    column-gap: 20px;
    z-index: 1;
    
  margin: 0;
  .icon {
    margin-right: 10px;
  }
  }
}

</style>