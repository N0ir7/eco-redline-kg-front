<template>
  <el-card class="box-card detail-panel" shadow="hover">
    <div slot="header" class="clearfix">
      <span>{{ title }}</span>
    </div>
    <div class="text item">
      <table cellspacing="30">
        <tbody>
          <tr v-for="(v, k) in currentInfo" :key="k">
            <td class="detail-key">{{ k }}:</td>
            <td class="detail-value"><span v-html="v"></span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "DetailPanel",
  data() {
    return {
      currentInfo: {}, // 存储需要显示的信息
      title: "详细信息",
    };
  },
  mounted() {
    this.$bus.$on("displayNodeInfo", this.getNodeInfo); // 监听是否有传过来的节点信息需要进行展示
    this.$bus.$on("displayLinkInfo", this.getLinkInfo); // 监听是否有传过来的边信息需要进行展示
  },
  methods: {
    getNodeInfo(node) { // 接受传过来的节点信息并作包装
      this.currentInfo = {
        nodeId: node.id,
        name: node.name,
        description: node.description,
      };
      this.title = "节点信息";
    },
    getLinkInfo(link) { // 接受传过来的边信息并作包装
      this.currentInfo = {
        linkId: link.id,
        relation:
          "<strong>" +
          link.source.name +
          "</strong>" +
          " --【 " +
          link.label +
          " 】--> " +
          "<strong>" +
          link.target.name +
          "</strong>",
        description: link.description,
      };
      this.title = "关系信息";
    }
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
  td {
    text-align: left;
    vertical-align: text-top;
  }
  .detail-key {
    width: auto;
    font-weight: bolder;
    font-size: 25px;
  }
  .detail-value {
    width: 100%;
    font-size: 20px;
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