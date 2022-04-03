<template>
  <div class="app-wrapper">
    <div class="navbar-wrapper">
      <nav-bar />
      <div class="carousel" v-if="this.$route.meta.showCarousel">
        <carousel :list="bannerList" />
      </div>
    </div>
    <app-main />
  </div>
</template>

<script>
import NavBar from "./components/NavBar/";
import AppMain from "./components/AppMain/";
import Carousel from "@/components/Carousel";
export default {
  name: "Layout",
  components: {
    AppMain,
    NavBar,
    Carousel,
  },
  data() {
    return {
      bannerList: [
        {
          id: 1,
          imgUrl: "/images/banner1.jpg",
        },
        {
          id: 2,
          imgUrl: "/images/banner2.jpg",
        },
        {
          id: 3,
          imgUrl: "/images/banner3.jpg",
        },
        {
          id: 4,
          imgUrl: "/images/banner4.jpg",
        },
      ],
    };
  },
};
</script>

<style lang = "scss" scoped>
@import "~@/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  .navbar-wrapper {
    background: url(/images/forest.jpg) no-repeat center center / cover fixed;
    .carousel {
      width: 100%;
      height: 668px;
      margin-top: 20px;
      overflow: hidden;
      /* background-color: #d3dce6; */
    }
    /* background-size: cover; */
  }
}
</style>