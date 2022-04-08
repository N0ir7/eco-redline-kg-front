<template>
  <div class="modeling-container">
    <div class="file-upload">
      <el-select v-model="uploadType" placeholder="请选择输入文件的方式">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <transition name="textarea" mode="out-in">
        <div class="manual-input" v-if="uploadType == 1">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
            placeholder="请输入文本"
            v-model="textarea" class="textarea"
          >
          </el-input>
          <div>
          <el-button class = "button" icon="el-icon-delete" @click="clearTextarea"
            >清空</el-button
          >
          <el-button class = "button" type="primary" icon="el-icon-upload" @click="uploadText">上传</el-button>
          </div>
        </div>
        <upload v-if="uploadType == 2" :on-success="handleSuccess" />
      </transition>

       <edit-table :list="result" :editTable="edit"/>
    </div>
    <div class="graph-modeling" v-if="success">
      <graph :graph="graph" :centerId="1" :canExpand="false"/>
    </div>
  </div>
</template>

<script>
import Graph from "@/components/KnowledgeGraph";
import Upload from "@/components/UploadFile";
import EditTable from "@/components/EditTable"
export default {
  name: "Modeling",
  components: {
    Graph,
    Upload,
    EditTable
  },
  data() {
    return {
      options: [
        {
          value: 1,
          label: "输入文本",
        },
        {
          value: 2,
          label: "上传文本文件",
        },
      ],
      uploadType: "",
      textarea: "",
      result:[],
      success:false,
    };
  },
  computed:{
    graph(){
      let nodes = [];
      let links = [];
      this.result.forEach((d)=>{
        nodes.push({
          id:d.subId,
          description:d.subDesc,
          name:d.subject
        })
        nodes.push({
          id:d.objId,
          description:d.objDesc,
          name:d.object
        })
        links.push({
          id:d.id,
          description:d.description,
          from: d.subId,
          to: d.objId,
          name:d.relation
        })
      })
      return{
        nodes,
        links
      }
    }
  },
  methods: {
    handleSuccess(data) {
        this.$message({
          message: '上传成功',
          type: 'success'
        });
      console.log("上传数据",data);
      // 处理数据
      this.result = [
          {
              id:1,
              relation:'属于',
              description:'正在升级中',
              subject:'丹江口水库',
              subDesc:"丹江口水库是我国一级保护区",
              subId:1,
              object:'国家保护区',
              objDesc:"国家规划的不能用于经济建设的地区",
              objId:2,
          },
          {
              id:2,
              relation:'计算',
              description:'正在升级中',
              subject:'生物多样性',
              subDesc:"描述生物种类的丰富程度",
              subId:3,
              object:'npp计算公式',
              objDesc:"npp = sqrt(x)",
              objId:4
          },
      ]
    },
    uploadText(){
        if(this.textarea.trim()!==""){
            this.handleSuccess(this.textarea);
            this.textarea = "";
        }
    },
    clearTextarea() {
      this.$confirm("此操作将清空文本框, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.textarea = "";
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    edit(){
      this.success = true;
    }
  },
};
</script>

<style lang = "scss" scoped>
.modeling-container {
  display: flex;
  justify-content: space-between;
  .file-upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap:20px;
    .manual-input{
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .textarea-enter-active,
    .textarea-leave-active {
      transition: all 0.25s;
    }
    .textarea-enter {
      opacity: 0;
      transform: translateY(-30px);
    }
    .textarea-leave-to {
      opacity: 0;
      transform: translateY(30px);
    }
    .button{
        margin: 20px;
    }
    .textarea{
        width:600px
    }
  }
}
</style>