<template>
  <div class="data-view">
    <div class="stat-row">
      <div class="stat-item">
        <div class="stat-icon-wrap" style="background:rgba(64,158,255,0.1);color:#409EFF;"><i class="el-icon-chat-line-round" /></div>
        <div class="stat-info">
          <span class="stat-label">用户留言</span>
          <dv-digital-flop :config="config" style="width:80px;height:36px;" />
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon-wrap" style="background:rgba(245,108,108,0.1);color:#F56C6C;"><i class="el-icon-star-on" v-show="like" /></div>
        <div class="stat-info">
          <span class="stat-label">今日新增</span>
          <dv-digital-flop :config="toDayConfig" style="width:80px;height:36px;" />
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon-wrap" style="background:rgba(230,162,60,0.1);color:#E6A23C;"><i class="el-icon-warning" /></div>
        <div class="stat-info">
          <span class="stat-label">遗失物品</span>
          <dv-digital-flop :config="LostConfig" style="width:80px;height:36px;" />
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon-wrap" style="background:rgba(103,194,58,0.1);color:#67C23A;"><i class="el-icon-circle-check" /></div>
        <div class="stat-info">
          <span class="stat-label">招领物品</span>
          <dv-digital-flop :config="FoundConfig" style="width:80px;height:36px;" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  data() { return {
    today: '', like: false,
    config: { number:[0], content:'{nt}条', style:{ fontSize:20, fill:'#303133', fontFamily:'Microsoft YaHei' } },
    toDayConfig: { number:[0], content:'{nt}条', style:{ fontSize:20, fill:'#F56C6C', fontFamily:'Microsoft YaHei' } },
    LostConfig: { number:[0], content:'{nt}件', style:{ fontSize:20, fill:'#303133', fontFamily:'Microsoft YaHei' } },
    FoundConfig: { number:[0], content:'{nt}件', style:{ fontSize:20, fill:'#303133', fontFamily:'Microsoft YaHei' } },
  }},
  mounted() { this.getData() },
  methods: {
    getData() {
      this.today = this.getCurrentDate()
      request.get("/main/getFeedBackAll").then(r => { this.config = { ...this.config, number:[r.data.data.total] } })
      request.get("/main/getFeedBack", { params:{ released:this.today } }).then(r => {
        this.toDayConfig = { ...this.toDayConfig, number:[r.data.data.total] }; this.like = r.data.data.total > 0
      })
      request.get("/main/getLost", { params:{ statusID:2 } }).then(r => { this.LostConfig = { ...this.LostConfig, number:[r.data.data.total] } })
      request.get("/main/getFound", { params:{ statusID:4 } }).then(r => { this.FoundConfig = { ...this.FoundConfig, number:[r.data.data.total] } })
    },
    getCurrentDate() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` },
  },
}
</script>

<style scoped>
.data-view { margin-bottom: 16px; }
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.stat-item {
  background: #fff;
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: transform 0.2s;
}
.stat-item:hover { transform: translateY(-2px); }
.stat-icon-wrap {
  width: 44px; height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.stat-info { display: flex; flex-direction: column; }
.stat-label { font-size: 13px; color: #909399; }
@media (max-width: 992px) { .stat-row { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .stat-row { grid-template-columns: 1fr; } }
</style>
