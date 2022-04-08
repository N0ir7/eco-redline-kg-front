<template>
  <div class="graph">
    <svg class="chart"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";

import {getGraphByNodeId} from '@/api/detail'
export default {
  props:['graph','centerId',"canExpand"], // graph: 传入的图谱数据; centerId, 图谱的中心元素; canExpand: 是否支持可拓展 
  data() {
    return {
      svg: null, // 图谱容器
      nodes: [], // 节点
      links: [], // 边
      rawNodes: [], // 原节点
      rawLinks: [], // 原边
      linkSelection: [], // 边的Selection
      nodeSelection: [], // 节点的Selection
      nodesNameSelection: [], 
      linksNameSelection: [],
      imagesSelection: [],
      simulation: null, // 物理模拟系统
      clipSelection: [],
      selectId: 0, // 被选中的节点id
      selectNodesSet: new Set(), // 被选中过的点集合
      options: {
        nodeIdFun: (d) => d.id,
        // nodeGroupFun: (d) => d.group,
        nodeTitleFun: (d) => `${d.name}`,
        nodeImageFun: (d) => `${d.imgUrl}`,
        linkSourceFun: (d) => d.from,
        linkTargetFun: (d) => d.to,
        linkIdFun: (d) => d.id,
        linkDescFun: (d) => d.description,
        labelFun: (d) => d.name,
        linkStrokeOpacity: 1,
        linkStroke: "#fff",
        nodeStroke: "#000",
        width: 800,
        height: 500,
        nodeRadius: 30,
        nodeFill: "#FFF",
        nodeStrength: -1000,
        linkStrokeWidth: 1, // 边的宽度
        linkStrokeLinecap: "round", // 线帽，即线两端的形状
      },
    };
  },
  mounted() {
    this.init();
  },
  computed:{
  },
  methods: {
    init() {
        this.$nextTick(function(){ // 第一次加载时是空的,所以要nextTick一下,因为这个图谱构建不好watch
          this.createForceGraph(this.graph, this.options);
          if(this.centerId){
            this.selectNodesSet.add(this.centerId);
          }   
        })
      
    },
    createForceGraph(
      {
        nodes, // 节点数组
        links, // 边数组
      },
      {
        nodeIdFun = (d) => d.id, // 提取节点id函数
        nodeGroupFun, // 提取节点所属组别函数
        nodeTitleFun, // 提取节点名称函数
        nodeImageFun, // 提取节点图像函数
        nodeFill = "currentColor", // 如果没有指定组别，即没有指定颜色时的默认填充颜色
        nodeStroke = "#fff", // 节点边框颜色
        nodeStrokeWidth = 1.5, // 节点边框粗细，单位pixel
        nodeStrokeOpacity = 1, // 节点边框透明度
        nodeRadius = 15, // 节点半径
        nodeStrength = -30, // 节点间静电力大小，负数为排斥，默认为-30
        linkSourceFun = ({ source }) => source, // 提取边当中的源节点函数
        linkTargetFun = ({ target }) => target, // 提取边当中的目标节点函数
        linkIdFun = (d) => d.id,
        linkDescFun = (d) => d.desc,
        labelFun = ({ label }) => label,
        linkStroke = "#999", // 边的颜色
        linkStrokeOpacity = 0.8, // 边的透明度
        linkStrokeWidth = 1, // 边的宽度
        linkStrokeLinecap = "round", // 线帽，即线两端的形状
        linkStrength, // 弹簧力大小
        colors = d3.schemeTableau10, // 一个由颜色字符串组成的数组
        width = 640, // 外边框宽度，单位pixel
        height = 400, // 外边框高度，单位pixel
        invalidation, // 当这个promise异步请求执行完，便停止模拟
      } = {}
    ) {
      if (nodeTitleFun === undefined) nodeTitleFun = nodeIdFun; // 如果没有指定提取标题的函数，则直接将id作为标题

      this.rawNodes = nodes;
      links = d3.map(links, (d) => ({
        source: linkSourceFun(d),
        target: linkTargetFun(d),
        label: labelFun(d),
        id: linkIdFun(d),
        description: linkDescFun(d)
      })); // 将links数组重新包装
      this.rawLinks = links;
      // 进行一些力模型的预处理
      const forceNode = d3.forceManyBody();
      if (nodeStrength !== undefined) forceNode.strength(nodeStrength); // 静电力大小

      const forceLink = d3.forceLink(links).id(nodeIdFun).distance(200); // 弹簧力大小
      if (linkStrength !== undefined) forceLink.strength(linkStrength);

      const forceCollide = d3.forceCollide(nodeRadius); // 碰撞检测
      // const forceCenter = d3.forceCenter(width / 2, height / 2); // 向心力的中心

      // 生成一个物理模拟引擎
      this.simulation = d3
        .forceSimulation(nodes)
        .force("link", forceLink)
        .force("charge", forceNode)
        .force("collide", forceCollide)
        // .force("center", forceCenter);
      // this.simulation = this.generateSimulationEngine(links,nodes);
      // 生成一块画布
      this.svg = d3
        .select(".chart")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width, -height/2, width, height]) // 视图空间，相当于我们的截图放大
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .call(
          // 开启放大缩小及平移功能
          d3
            .zoom()
            .extent([
              [0, 0],
              [width, height],
            ])
            .scaleExtent([0.1, 8])
            .on("zoom", zoomed)
        );

      addMarkers(this); // 添加标记

      // 生成一个总容器
      const g = this.svg.append("g").attr("class", "container");

      // 先加入边的容器
      this.linkSelection = g
        .append("g")
        .attr("class", "line-container")
        .selectAll("g.line")
        .data(links, linkIdFun)
        .join("g")
        .attr("class", "line")
        .attr('id',(d)=>`line-${linkIdFun(d)}`);
      // 再加入边
      this.linkSelection
        .append("path")
        .attr("id", (d) => "text-path-" + linkIdFun(d))
        .attr("stroke", linkStroke)
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr("stroke-width", linkStrokeWidth) // 如果边有权值，这里之后可以拓展为函数
        .attr("stroke-linecap", linkStrokeLinecap)
        .attr("marker-mid", "url(#arrow)");
      // 添加边的关系的文字
      this.linksNameSelection = this.linkSelection
        .append("g")
        .append("text")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "middle")
        .style("fill", "#000")
        .style("font-size", "10px")
        .style("font-weight", "bold");
      // 设置关系文字的路径
      this.linksNameSelection
        .append("textPath")
        .attr("xlink:href", (d) => "#text-path-" + linkIdFun(d))
        .attr("startOffset", "50%")
        .text((d) => d.label)
        .on('click',this.onLinkClicked);
      // 先加入节点的容器
      this.nodeSelection = g
        .append("g")
        .attr("class", "node-container")
        .selectAll("g.node")
        .data(nodes, nodeIdFun)
        .join("g")
        .attr("class", "node")
        .attr("id", (d) => `node-${nodeIdFun(d)}`)
        .call(this.drag(this.simulation))
        .on("click", this.onClicked);

      // 加入节点圆圈边框
      this.nodeSelection
        .append("circle")
        .attr("fill", nodeFill)
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)
        .attr("r", nodeRadius);

      // 添加指定颜色
      if (nodeGroupFun) {
        // 如果指明了每个节点的组别
        let nodeGroups = d3.sort(nodes.map(nodeGroupFun)); // 排序以得到定义域
        let colorFun =
          nodeGroupFun == null ? null : d3.scaleOrdinal(nodeGroups, colors); // 生成一个以nodeGroups为定义域，以colors为值域的离散映射函数
        this.nodeSelection
          .select("circle")
          .attr("fill", (d) => colorFun(nodeGroupFun(d))); // 指定每个node的颜色
      }
      // 添加节点文字
      if (nodeTitleFun) {
        this.nodesNameSelection = this.nodeSelection
          .append("text")
          .text(nodeTitleFun)
          .style("font-size", "12")
          .style("fill", "#fff")
          .attr("dy", 40);
      }
      // 添加图片
      if (nodeImageFun) {
        // 添加裁剪区域
        this.clipSelection = this.nodeSelection
          .append("clipPath")
          .attr("id", (d) => `clip-${nodeIdFun(d)}`);
        this.clipSelection.append("circle").attr("r", nodeRadius);
        // 添加图片
        this.imagesSelection = this.nodeSelection
          .append("image")
          .attr("width", nodeRadius * 2)
          .attr("height", nodeRadius * 2)
          .attr("clip-path", (d) => `url(#clip-${nodeIdFun(d)})`)
          .attr("xlink:href", nodeImageFun)
          .on("error", this.onError);
      }

      // 让物理引擎开始工作，注意传函数不能带参数
      this.simulation.on("tick", this.ticked);

      // 运行一个校验
      if (invalidation != null) invalidation.then(() => this.simulation.stop());

      function zoomed({ transform }) {
        // 放大缩小平移事件的监听函数
        g.attr("transform", transform);
      }
      function addMarkers(pt) {
        // 添加标记
        let _this = pt;
        let def = _this.svg.append("defs");

        let markerArrow = def
          .append("marker")
          .attr("id", "arrow")
          .attr("viewBox", "-20 -5 30 10") // x,y,width,height
          .attr("refX", -10) // 锚点代表的x坐标
          .attr("refY", 0) // 锚点代表的y
          .attr("markerWidth", nodeRadius * 1.5)
          .attr("markerHeight", nodeRadius * 1.5)
          .attr("orient", "auto");

        markerArrow
          .append("path")
          .attr("fill", "#fff")
          .attr("d", "M2,-3L5,0L2,3");

        markerArrow
          .append("rect")
          .attr("x", -20) // 沿着线方向
          .attr("y", -5) // 垂直线方向
          .attr("width", 20) // 沿着线方向的长度
          .attr("height", 10) // 垂直线方向的长度
          .attr("rx", 2)
          .attr("fill", "#fff");
      }
    },
    onError(e) { // 当图片显示错误的回调函数
      d3.select(e.currentTarget).style("display", "none");
    },
    drag(simulation) { // 用于物理引擎仿真的拖拽函数
      function dragstarted(event) { // 拖拽开始时
        if (!event.active) simulation.alphaTarget(0.3).restart();
      }

      function dragged(event) { // 拖拽过程中
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) { // 拖拽结束时
        if (!event.active) simulation.alphaTarget(0);
      }
      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    },
    getRawLinks(links){ // 将d3物理引擎托管的links解除出来,包装成一开始的links
      return links.map((d)=>({
            source: this.options.nodeIdFun(d.source),
            target: this.options.nodeIdFun(d.target),
            label: d.label,
            id: this.options.linkIdFun(d),
            description: this.options.linkDescFun(d)
          }))
    },
    packageLinks(links){ // 将请求的response中的data中的links包装成可以交给d3托管的格式
      return d3.map(links, (d) => ({
            source: this.options.linkSourceFun(d),
            target: this.options.linkTargetFun(d),
            label: this.options.labelFun(d),
            id: this.options.linkIdFun(d),
            description:this.options.linkDescFun(d)
          }))
    },
    debug(obj){ // 用于debug输出的函数
      if(obj instanceof Set){
        return obj
      }
      return JSON.parse(JSON.stringify(obj));
    },
    async onClicked(e, d) { // 当节点被点击时的回调函数
      // 固定当前节点
      d.fx = d.x;
      d.fy = d.y;
      // 选中该节点
      this.selectId = d.id;
      this.selectNodesSet.add(this.selectId);
      // 将该节点信息传给detailpanel去显示
      this.$bus.$emit(
        "displayNodeInfo",
        this.rawNodes.filter(
          (d) => this.options.nodeIdFun(d) === this.selectId
        )[0]
      );
      // 将被点击的边框设为橙色
      d3.select(e.currentTarget).select("circle").attr("stroke", "#ee8031");

      if(this.canExpand){ // 如果需要支持可拓展
        // 去服务器请求被点击节点的相关数据
        await getGraphByNodeId(this.selectId).then((res)=>{
           // 先统计一下当前有哪些节点
          let nodesSet = new Set(
            this.rawNodes
              .map((d) => this.options.nodeIdFun(d))
          );
          // 将查询来的节点和原来的节点合并,注意要去重
          res.data.data.nodes.forEach(d => {
            if(!nodesSet.has(this.options.nodeIdFun(d))){
              nodesSet.add(this.options.nodeIdFun(d));
              this.rawNodes.push(d);
            }
          });
          // 先统计一下当前有哪些边
          let linksSet = new Set(
            this.rawLinks
              .map((d) => this.options.linkIdFun(d))
          );
          // 为了统一格式,先将之前被d3的物理引擎托管的边解封成托管前的边数据(数据格式有些不一样)
          this.rawLinks = this.getRawLinks(this.rawLinks);
          // 将刚刚从服务器请求得到的response里的边信息包装成能被d3托管的边数据,然后和之前的边数据进行合并,并且注意要去重
          this.packageLinks(res.data.data.links).forEach(d => {
            if(!linksSet.has(this.options.linkIdFun(d))){
              linksSet.add(this.options.linkIdFun(d));
              this.rawLinks.push(d);
            }
          });
        })
        // 因为之前只是简单地将原数据和新数据合并,其中有一些是我们不需要,需要隐藏并删除的数据,所以需要更新数据(带拓展版)
        this.updateDataWithExp()
      }
      else{
        // 更新数据(不带拓展版)
        this.updateData();
      }
      // 更新图谱,重新渲染
      this.updateGraph();
    },
    onLinkClicked(e,d){ // 当边被点击时的回调函数
      let id = d.id;
      // 将边的信息传递给detailpanel进行展示
      this.$bus.$emit(
        "displayLinkInfo",
        this.rawLinks.filter(
          (d) => this.options.linkIdFun(d) === id
        )[0]
      );
    },
    ticked() { // 用于时间推进更新节点坐标的函数
      this.linkSelection.select("path").attr("d", (d) => {
        let midX = (d.source.x + d.target.x) / 2;
        let midY = (d.source.y + d.target.y) / 2;
        return `M ${d.source.x}, ${d.source.y} L ${midX},${midY} L${d.target.x},${d.target.y}`;
      });
      this.nodeSelection
        .select("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);

      this.nodeSelection
        .select('clipPath')
        .select("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);
      this.nodeSelection
        .select('text')
        .attr("x", (d) => d.x).attr("y", (d) => d.y);
      this.nodeSelection
        .select('image')
        .attr("x", (d) => d.x - this.options.nodeRadius)
        .attr("y", (d) => d.y - this.options.nodeRadius);
    },
    updateData(){ // 更新数据,不带拓展版
      let relatedNodesIdSet = new Set(
        this.rawLinks
          .filter((d) => this.options.nodeIdFun(d.source) === this.selectId)
          .map((d) => this.options.nodeIdFun(d.target))
      );
      let tmpNodeSet = d3.union(relatedNodesIdSet, this.selectNodesSet);
      this.nodes = this.rawNodes.filter((d) =>
        tmpNodeSet.has(this.options.nodeIdFun(d))
      );
      this.links = this.rawLinks.filter(
        (d) =>
          tmpNodeSet.has(this.options.nodeIdFun(d.source)) &&
          tmpNodeSet.has(this.options.nodeIdFun(d.target))
      );
    },
    updateDataWithExp(){ // 更新数据,带拓展版
      let relatedNodesIdSet = new Set(
        this.rawLinks
          .filter((d) => d.source === this.selectId || d.target === this.selectId)
          .map((d) => d.target===this.selectId?d.source:d.target)
      );
      let tmpNodeSet = d3.union(relatedNodesIdSet, this.selectNodesSet);
      this.nodes = this.rawNodes.filter((d) =>
        tmpNodeSet.has(this.options.nodeIdFun(d))
      );
      this.links = this.rawLinks.filter(
        (d) =>
          tmpNodeSet.has(d.source) &&
          tmpNodeSet.has(d.target)
      );
      // 这两步很关键,用筛选后数据覆盖原始数据,因为带拓展,所以其对节点的操作不是隐藏,而是直接删除,所以可以直接覆盖,不需要保留原始数据
      this.rawNodes = this.nodes;
      this.rawLinks = this.links;
    },
    updateGraph() { // 重新渲染图谱
    this.simulation.nodes(this.nodes);
      this.simulation.force("link").links(this.links);
      this.nodeSelection = this.nodeSelection.data(this.nodes, this.options.nodeIdFun).join(
        (enter) => 
          enter
            .append("g")
            .attr("class", "node")
            .attr("id", (d) => `node-${this.options.nodeIdFun(d)}`)
            .call(this.drag(this.simulation))
            .on("click", this.onClicked)
            .call(gNode=>gNode
            .append("circle")
            .attr("fill", this.options.nodeFill)
            .attr("stroke", this.options.nodeStroke)
            .attr("stroke-opacity", this.options.nodeStrokeOpacity)
            .attr("stroke-width", this.options.nodeStrokeWidth)
            .attr("r", this.options.nodeRadius))
            .call(gNode=>{
              if (this.options.nodeImageFun) {
            // 添加裁剪区域
            gNode
              .append("clipPath")
              .attr("id", (d) => `clip-${this.options.nodeIdFun(d)}`)
              .append("circle")
              .attr("r", this.options.nodeRadius);
            // 添加图片
            gNode
              .append("image")
              .attr("width", this.options.nodeRadius * 2)
              .attr("height", this.options.nodeRadius * 2)
              .attr(
                "clip-path",
                (d) => `url(#clip-${this.options.nodeIdFun(d)})`
              )
              .attr("xlink:href", this.options.nodeImageFun)
              .on("error", this.onError);
              }
            })
            .call(gNode=>{
              // 添加节点文字
              if (this.options.nodeTitleFun) {
                gNode
                  .append("text")
                  .text(this.options.nodeTitleFun)
                  .style("font-size", "12")
                  .style("fill", "#fff")
                  .attr("dy", 40);
              }
            }),
        (update)=>update,
        (exit)=>exit.transition().duration(500).ease(d3.easeLinear).style('opacity',0).remove()
      );
      this.linkSelection = this.linkSelection.data(this.links,this.options.linkIdFun).join(
        (enter)=>enter
        .append('g')
        .attr("class", "line")
        .attr('id',(d)=>`line-${this.options.linkIdFun(d)}`)
        .call(glink=>glink
          .append("path")
          .attr("id", (d) => "text-path-" + this.options.linkIdFun(d))
          .attr("stroke", this.options.linkStroke)
          .attr("stroke-opacity", this.options.linkStrokeOpacity)
          .attr("stroke-width", this.options.linkStrokeWidth) // 如果边有权值，这里之后可以拓展为函数
          .attr("stroke-linecap", this.options.linkStrokeLinecap)
          .attr("marker-mid", "url(#arrow)"))
        .call(glink=>glink
          .append("g")
          .append("text")
          .style("text-anchor", "middle")
          .style("dominant-baseline", "middle")
          .style("fill", "#000")
          .style("font-size", "10px")
          .style("font-weight", "bold")
          .append("textPath")
          .attr("xlink:href", (d) => "#text-path-" + this.options.linkIdFun(d))
          .attr("startOffset", "50%")
          .text((d) => d.label))
          .on('click',this.onLinkClicked),

        (update)=>update,
        (exit)=>exit.transition().duration(500).ease(d3.easeLinear).style('opacity',0).remove()
        );
    },
  },
};
</script>

<style lang = "scss" scoped>
.graph {
  position: relative;
  width: 800px;
  height: 500px;
  overflow: hidden;
  border-radius: 20px;
  margin: 10px;
  background: #154360
    repeating-linear-gradient(
      30deg,
      hsla(0, 0%, 100%, 0.1),
      hsla(0, 0%, 100%, 0.1) 15px,
      transparent 0,
      transparent 30px
    );

  ::v-deep .node,
  ::v-deep .line {
    animation: enter .5s 1;
  }
  
}
@keyframes enter {
  from{opacity:0;}
  to{opacity: 1;}
}
</style>
