<template>
   <div class="table-container">
    <el-table :data="list" border style="width: 100%" max-height="250">
      <el-table-column type="expand">
      <template slot-scope="{row}">
        <el-form label-position="left" class="table-expand">
          <el-form-item label="主语描述:">
             <el-input v-show="isEdit" class = "textarea" type = "textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="row.subDesc" placeholder="请输入主语描述"></el-input>
             <span v-show="!isEdit">{{row.subDesc}}</span>
          </el-form-item>
          <el-form-item label="宾语描述:">
             <el-input v-show="isEdit" class = "textarea" type = "textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="row.objDesc" placeholder="请输入宾语描述"></el-input>
             <span v-show="!isEdit">{{row.objDesc}}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
        <el-table-column label="ID" width="40"> 
          <template slot-scope="{row}">
              {{row.id}}
          </template>
      </el-table-column>
        <el-table-column label="主语" width="180"> 
          <template slot-scope="{row}">
            <el-input v-show="isEdit" v-model="row.subject" placeholder="请输入主语"></el-input>
              <span v-show="!isEdit">{{row.subject}}</span>
          </template>
      </el-table-column>
      <el-table-column label="谓语" width="180"> 
          <template slot-scope="{row}">
            <el-input v-show="isEdit" v-model="row.relation" placeholder="请输入关系"></el-input>
              <span v-show="!isEdit">{{row.relation}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="date" label="宾语" width="180"> 
          <template slot-scope="{row}">
            <el-input v-show="isEdit" v-model="row.object" placeholder="请输入宾语"></el-input>
              <span v-show="!isEdit">{{row.object}}</span>
          </template>
      </el-table-column>
    </el-table>
    <el-button class = "button" icon="el-icon-delete" @click="toggoleEdit" v-show="!isEdit">编辑</el-button>
    <el-button class = "button" type = "danger" @click="toggoleEdit" v-show="isEdit">完成</el-button>
    <el-button class = "button" type="primary" @click="finish" v-show="!isEdit">提交</el-button>
  </div>
</template>

<script>
export default {
  props:{
    list:Array, // 需要渲染的数据
    editTable:Function, // 渲染图谱
  },
  data(){
    return{
      isEdit:false,
    }
  },
  methods: {
    toggoleEdit(){
      this.isEdit = !this.isEdit
    },
    finish(){
      this.$confirm("此操作将提交三元组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.textarea = "";
          this.$message({
            type: "success",
            message: "提交成功!",
          });
          this.editTable() // 渲染图谱
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消提交",
          });
        });
    }
  },
}
</script>

<style lang = "scss" scoped>
.table-expand {
    font-size: 0;
  ::v-deep label {
    width: 80px;
    color: #99a9bf;
  }
  ::v-deep .el-form-item {
    display: flex;
    /* justify-content: space-between; */
    margin: 0;
    
    /* width: 50%; */
  }
  .textarea{
      width: 520px;
      margin-right: 10px;
  }
}
.button{
  margin: 10px;
}
</style>