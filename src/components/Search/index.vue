<template>
  <div class="search" @click.stop>
    
    <el-input ref="search"
      v-model="content"
      placeholder="请输入内容"
      class="input-with-icon"
      :class="{show:isSearch}"
      @focus="onFocus"
    ></el-input>
    <div class="icon-border"  @click="toggleSearch">
  <svg class="icon" aria-hidden="true" >
    <use xlink:href="#icon-a-1-sousuo"></use>
  </svg>
    </div>
  </div>

  
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      content: "",
      isSearch: false
    };
  },
  mounted() {
  },
  methods: {
    toggleSearch(){
      console.log('toggoleSearch',this.isSearch);
      this.isSearch = !this.isSearch;
      this.$bus.$emit('onClickSearch');
    },
    close(e) {
      // console.log('close',this.isSearch)
      console.log(e)
      this.isSearch = false;
      this.$refs['search'].blur();
      this.$bus.$emit('onClickSearch');
    },
    onFocus(){
      if(!this.isSearch){
        this.toggleSearch()
      }
    }
  },
  watch:{
    isSearch(value) {
      if (value) {
        document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    }
  }
};
</script>

<style lang = "scss" scoped>
.search{ 
  display:flex;
  .el-input {
    position: relative;
    transition: width 0.6s;
    ::v-deep .el-input__inner {
      padding-left: 0;
      padding-right: 0;
      border: 0;
    }
  }
}
.icon{
    cursor: pointer;
  }
.icon-border{
  background-color: #fff;
    /* color: #909399; */
    position: relative;
    opacity: 0.8;
    /* border: 1px solid #DCDFE6; */
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    /* z-index: 1; */
    padding: 8px 20px;
    white-space: nowrap;
}
.input-with-icon{
  width: 100px; 
  ::v-deep .el-input-group__append {
    background-color: #fff;
  }
}
.show{
  width: 400px;
  overflow: hidden;
  background-color:#fff ;
  border: 1px solid #DCDFE6;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>