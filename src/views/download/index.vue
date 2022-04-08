<template>
  <div class="download-container">
    <el-table :data="list" border style="width: 100%">
        <el-table-column label="ID" width="40"> 
          <template slot-scope="{row}">
              {{row.id}}
          </template>
      </el-table-column>
        <el-table-column label="文件名" > 
          <template slot-scope="{row}">
              {{row.name}}
          </template>
      </el-table-column>
      <el-table-column label="文件类型" :filters="fileTypes"
      :filter-method="filterFileType"> 
          <template slot-scope="{row}">
            <el-tag :type="info(row.type)">
              {{row.type}}
              </el-tag>
          </template>
      </el-table-column>
      <el-table-column prop="date" label="上传日期" width="180" sortable> 
          <template slot-scope="{row}">
              {{row.date}}
          </template>
      </el-table-column>
      <el-table-column prop="downloads" label="下载量" width="180" sortable> 
          <template slot-scope="{row}">
              {{row.downloads}}
          </template>
      </el-table-column>
      <el-table-column label="大小" width="180" sortable> 
          <template slot-scope="{row}">
              {{row.size}}
          </template>
      </el-table-column>
      <el-table-column label="操作"> 
          <template slot-scope="{row}">
            <el-link target = '_blank' :href="row.link" :underline = "false">
              <el-button @click="handleClick(row)" size="small">下载</el-button>
            </el-link>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Download",
  data() {
    return {
      list: [
        {
          id:1,
          name: "生态红线规划准则.pdf",
          type:'标准文件',
          date: "2016-05-02",
          downloads: 122,
          size: '1.2 mb',
          link:'/data/helloworld.txt'
        },
        {
          id:2,
          name: "基于知识图谱的研究方法.pdf",
          type:'文献',
          date: "2016-05-02",
          downloads: 3000,
          size: '2.2 mb',
          link:'/data/helloworld.txt'
        },
        {
          id:3,
          name: "neo4j.pdf",
          type:'书籍',
          date: "2016-05-02",
          downloads: 2000,
          size: '3.4 mb',
          link:'/data/helloworld.txt'
        },
        {
          id:4,
          name: "丹江口水库监测报告.pdf",
          type:'数据',
          date: "2016-05-02",
          downloads: 110,
          size: '122 kb',
          link:'/data/helloworld.txt'
        },
      ],
      typeMap:{
        "数据":'info',
        "标准文件":'danger',
        "书籍":'success',
        "文献":'warning'
      }
    };
  },
  computed:{
    fileTypes(){
      let obj = [];
      for(let key in this.typeMap){
        obj.push({
          text:key,
          value:key
        })
      }
      return obj;
    }
  },
  methods: {
    handleClick(){
      // console.log(row);
    },
    info(type){
      return this.typeMap[type];
    },
    filterFileType(value, row) {
        return row.type === value;
    },
  },
};
</script>

<style lang = 'scss' scoped>
.download-container{
  margin: 20px;
}
</style>