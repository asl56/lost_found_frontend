<template>
  <div class="admin-dashboard">
    <!-- 顶部统计卡片 -->
    <DataView />

    <!-- 图表区域：2x2 网格 -->
    <div class="chart-grid">
      <div class="chart-card">
        <Notice />
      </div>
      <div class="chart-card">
        <HomeFeedBack />
      </div>
      <div class="chart-card">
        <HomeLost />
      </div>
      <div class="chart-card">
        <HomeFound />
      </div>
    </div>
  </div>
</template>

<script>
import Notice from './HomeNoticeView.vue'
import DataView from './DataView.vue'
import HomeFeedBack from './HomeFeedBack.vue'
import HomeLost from './HomeLost.vue'
import HomeFound from './HomeFound.vue'
export default {
  components: { Notice, DataView, HomeFeedBack, HomeLost, HomeFound },
  data() { return { imgUrl: '' } },
  mounted() {
    const av = localStorage.getItem('avatar')
    if (av) this.imgUrl = `/main/download?name=${av}`
  },
}
</script>

<style scoped>
.admin-dashboard { padding: 0; max-width: 100%; }

/* 2x2 图表网格 */
.chart-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}
.chart-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow: hidden;
}

/* 响应式 */
@media (max-width: 1200px) {
  .chart-grid { gap: 12px; }
}
@media (max-width: 768px) {
  .chart-grid { grid-template-columns: 1fr; }
}
</style>
