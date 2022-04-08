<template>
  <div class="search" @click.stop>
    
    <el-input ref="search"
      v-model="content"
      placeholder="请输入内容"
      class="input-with-icon"
      :class="{show:isSearch}"
      @focus="onFocus" @keyup.enter.native="clickSearch"
    ><template slot="append">
      <el-tooltip class="item" effect="light" content="请先选择再搜索" placement="bottom" v-model="visible" :manual="true">
      <el-dropdown size="mini" @command="selectItem">
  <span class="el-dropdown-link">
    {{choose}}<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item v-if="choose!=='节点'" command="节点">节点</el-dropdown-item>
    <el-dropdown-item v-if="choose!=='实例'" command="实例">实例</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
    </el-tooltip>
      
      </template>
      </el-input>
    
    <div class="icon-border"  @click="clickSearch">
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
      isSearch: false,
      choose:"选择",
      visible:false,
    };
  },
  mounted() {
  },
  methods: {
    clickSearch(){ // 当点击搜索按钮时
      if(this.isSearch){ // 如果处于搜索状态,则进行搜索
        if(this.content.trim()!==""){ // 输入内容不能为空
          if(this.choose==="选择"){ // 如果还未选择搜索的范围
             // 显示0.7s的提示文字
            this.visible = true;
            setTimeout(() => {
              this.visible = false;
            }, 700);
          }else{ // 如果选择了搜素范围
            if(this.choose==="节点"){ // 如果是节点,则跳转至节点管理页面
                this.$router.push({ path: '/management', query: { activeType: 2,name:this.content } })
            }else if(this.choose=="实例"){ // 如果是实例,则跳转至实例管理页面
                this.$router.push({ path: '/management', query: { activeType: 1,name:this.content } })
            }
          }
        }
      }else{ // 如果不处于搜索状态,则是更改输入框状态
        this.toggleSearch();
      }
    },
    toggleSearch(){ // 更改搜索栏状态
      this.isSearch = !this.isSearch;
      this.$bus.$emit('onClickSearch'); // 告诉网站标题进行隐藏
    },
    close() { // 当点击页面中非搜索组件部分的回调函数
      this.isSearch = false; // 退出搜索状态
      this.$refs['search'].blur(); // 触发输入栏的blur
      this.$bus.$emit('onClickSearch'); // 告诉网站标题进行显示
    },
    onFocus(){ // 输入栏获得焦点时的回调函数
      if(!this.isSearch){ // 如果不是搜索状态,则切换为搜索状态
        this.toggleSearch()
      }
    },
    selectItem(command){ // 确定用户的搜索范围选项
      this.choose = command;
    }
  },
  watch:{
    isSearch(value) { // 动态添加监听器
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
      /* padding-left: 0; */
      padding-right: 0;
      /* border: 0; */
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
  width: 200px; 
  ::v-deep .el-input-group__append {
    padding: 0 10px;
    /* background-color: #fff; */
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