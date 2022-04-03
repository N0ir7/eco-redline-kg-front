<template>
  <div>
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".txt,.pdf,.csv" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      Drop text file (.txt,.pdf,.csv) here or
      <el-button :loading="loading" style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">
        <i class="el-icon-upload el-icon--right"></i>Browse
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name:'UploadFile',
  props:{
    onSuccess: Function,
  },
  data(){
    return{
      loading:false,
      text:'',
    }
  },
methods: {
  handleClick(e){
    const files = e.target.files;
      const rawFile = files[0]; // only use files[0]
      if (!rawFile) return;
      this.upload(rawFile);
  },
  handleUpload(e){
    console.log(e);
    this.$refs['excel-upload-input'].click();
  },
  handleDragover(e){

      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
  },
  handleDrop(e){
    e.stopPropagation();
      e.preventDefault();
      if (this.loading) return;
      const files = e.dataTransfer.files;
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!');
        return;
      }
      const rawFile = files[0]; // only use files[0]

      if (!this.isTextFile(rawFile)) {
        this.$message.error('Only supports upload .pdf, .txt, .csv suffix files');
        return false;
      }
      this.upload(rawFile);
  },

    isTextFile(file) {
      return /\.(txt|pdf|csv)$/.test(file.name);
    },
  upload(rawFile) {
      this.$refs['excel-upload-input'].value = null; // fix can't select the same excel

      // if (!this.beforeUpload) {
      //   this.readerData(rawFile)
      //   return
      // }
      // const before = this.beforeUpload(rawFile)
      // if (before) {
        this.readerData(rawFile);
      // }
    },
    readerData(rawFile) {
      this.loading = true;
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          // console.log(data);
          this.text = data;
          resolve();
        }
        reader.readAsText(rawFile,'utf-8')
      }).then(()=>{
        this.loading = false;
        this.onSuccess(this.text)
      })
      .catch(()=>{
        this.loading = false;
        this.$message.error('read Error!')
        })
    },
},

}
</script>

<style lang = "scss" scoped>
.excel-upload-input{
  display: none;
  z-index: -9999;
}
.drop{
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>