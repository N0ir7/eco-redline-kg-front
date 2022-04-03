<template>
  <el-card class="box-card detail-panel" shadow="hover">
    <div slot="header" class="clearfix">
      <span>节点信息</span>
    </div>
    <div class="text item">
      <table cellspacing="30">
        <tbody>
          <tr v-for="(v, k) in currentNode" :key="k">
            <td class="detail-key">{{ k }}:</td>
            <td class="detail-value"><span v-html="v"></span></td>
          </tr>
        </tbody>
      </table>

      <el-form ref="form" label-width="0px" v-show="ifShow">
        <el-form-item>
          <el-select
            v-model="currentType"
            placeholder="请选择查询关系"
            class="type-select"
          >
            <el-option
              v-for="(type, i) in relationshipTypes"
              :label="type"
              :value="urls[i]"
              :key="type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" class="submit-btn"
            >查询关系</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "DetailPanel",
  data() {
    return {
      ifShow: false,
      currentNode: {},
      currentType: "",
      relationshipTypes: [
        "ACTED_IN",
        "DIRECTED",
        "WROTE",
        "PRODUCED",
        "REVIEWED",
      ],
      urls: ["actedby", "directed", "wrote", "produced", "reviewed"],
    };
  },
  
    mounted() {
        this.$bus.$on('displayNodeInfo',this.getNodeInfo);
    },
  methods: {
      getNodeInfo(node){
        // console.log(node);
        this.currentNode = {
            id:node.id,
            name:node.name,
            summary:node.summary
        };
      },
    onSubmit() {},
  },
};
</script>

<style lang='scss' scoped>
.detail-panel {
  right: 10px;
  top: 40px;
  border-radius: 4px;
  width: 40%;
  cursor: pointer;
  td{
    text-align: left;
    vertical-align: text-top;
    
  }
  .detail-key {
    width: auto;
    font-weight: bolder;
    font-size: 20px;
  }
  .detail-value{
      width: 100%;
      font-size: 12px;
  }
  .type-select {
    margin-top: 25px;
    height: 20px;
  }
  .submit-btn {
    width: 100%;
    height: 30px;
    line-height: 0px;
    margin-top: 0px;
  }
}
</style>