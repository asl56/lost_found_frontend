<template>
  <div class="home-page">
    <!-- ===== Hero 横幅 ===== -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">失物招领平台</h1>
        <p class="hero-desc">发布失物信息，联系失主，让每一件物品都能找到回家的路</p>
        <div class="hero-actions">
          <el-button type="primary" size="medium" round icon="el-icon-plus" @click="$router.push('/UserIndex/UserLostHome')">发布失物</el-button>
          <el-button type="success" size="medium" round icon="el-icon-search" @click="$router.push('/UserIndex/UserFoundHome')">浏览招领</el-button>
        </div>
      </div>
    </section>

    <!-- ===== 数据统计 ===== -->
    <section class="stats">
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(64,158,255,0.12);color:#409EFF;"><i class="el-icon-s-order" /></div>
        <div class="stat-body">
          <span class="stat-num">{{ stats.lostCount }}</span>
          <span class="stat-label">失物信息</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(103,194,58,0.12);color:#67C23A;"><i class="el-icon-circle-check" /></div>
        <div class="stat-body">
          <span class="stat-num">{{ stats.foundCount }}</span>
          <span class="stat-label">招领信息</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(230,162,60,0.12);color:#E6A23C;"><i class="el-icon-user" /></div>
        <div class="stat-body">
          <span class="stat-num">{{ stats.userCount }}</span>
          <span class="stat-label">注册用户</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(245,108,108,0.12);color:#F56C6C;"><i class="el-icon-chat-line-round" /></div>
        <div class="stat-body">
          <span class="stat-num">{{ stats.contactCount }}</span>
          <span class="stat-label">联系次数</span>
        </div>
      </div>
    </section>

    <!-- ===== 公告栏 ===== -->
    <section class="notice-bar">
      <i class="el-icon-bell notice-bell" />
      <span class="notice-text" v-if="notice.title">{{ notice.title }}</span>
      <span class="notice-text" v-else>欢迎使用失物招领平台，请发布你的失物或招领信息</span>
    </section>

    <!-- ===== 主体双栏 ===== -->
    <section class="main-sections">
      <!-- 左侧：最新失物 -->
      <div class="section-panel">
        <div class="panel-header">
          <div class="panel-title">
            <span class="dot dot-blue" />
            <span>最新失物</span>
          </div>
          <el-button type="text" icon="el-icon-arrow-right" @click="handleLost">更多</el-button>
        </div>
        <div class="lost-grid">
          <div v-for="item in LostList" :key="item.id" class="item-card">
            <div class="item-img-wrap" @click="handelView(item)">
              <el-image :src="item.itemPhoto" fit="cover" class="item-img" lazy><div slot="error" class="img-fallback"><i class="el-icon-picture-outline" /></div></el-image>
              <span class="item-badge badge-lost">失物</span>
            </div>
            <div class="item-info">
              <h4 class="item-title" @click="handelView(item)">{{ item.title }}</h4>
              <p class="item-date">{{ item.releaseDate }}</p>
              <div class="item-actions">
                <el-button type="text" size="mini" icon="el-icon-view" @click="handelView(item)">详情</el-button>
                <el-button type="text" size="mini" icon="el-icon-chat-line-round" @click="showContact(item.id,'lost')">留言</el-button>
              </div>
            </div>
          </div>
          <div v-if="LostList.length === 0" class="empty-placeholder"><i class="el-icon-inbox" /><p>暂无失物信息</p></div>
        </div>
      </div>

      <!-- 右侧：最新招领 -->
      <div class="section-panel">
        <div class="panel-header">
          <div class="panel-title">
            <span class="dot dot-green" />
            <span>最新招领</span>
          </div>
          <el-button type="text" icon="el-icon-arrow-right" @click="handleFound">更多</el-button>
        </div>
        <div class="lost-grid">
          <div v-for="item in foundList" :key="item.id" class="item-card">
            <div class="item-img-wrap" @click="handelFoundView(item)">
              <el-image :src="item.itemPhoto" fit="cover" class="item-img" lazy><div slot="error" class="img-fallback"><i class="el-icon-picture-outline" /></div></el-image>
              <span class="item-badge badge-found">招领</span>
            </div>
            <div class="item-info">
              <h4 class="item-title" @click="handelFoundView(item)">{{ item.title }}</h4>
              <p class="item-date">{{ item.releaseDate }}</p>
              <div class="item-actions">
                <el-button type="text" size="mini" icon="el-icon-view" @click="handelFoundView(item)">详情</el-button>
                <el-button type="text" size="mini" icon="el-icon-chat-line-round" @click="showContact(item.id,'found')">留言</el-button>
              </div>
            </div>
          </div>
          <div v-if="foundList.length === 0" class="empty-placeholder"><i class="el-icon-inbox" /><p>暂无招领信息</p></div>
        </div>
      </div>
    </section>

    <!-- ===== 详情弹窗 ===== -->
    <el-dialog title="物品详情" :visible.sync="dialogShowView" width="480px">
      <div v-if="showView.itemPhoto" class="detail-hero">
        <img :src="showView.itemPhoto" class="detail-img" />
        <span class="detail-status-tag" :class="showView.status === '已找到' ? 'tag-done' : 'tag-active'">{{ showView.status }}</span>
      </div>
      <div class="detail-body">
        <h2 class="detail-title">{{ showView.title }}</h2>
        <div class="detail-info-grid">
          <div class="info-item"><span class="info-label"><i class="el-icon-document" /> 描述</span><p class="info-value">{{ showView.description || '暂无描述' }}</p></div>
          <div class="info-row">
            <div class="info-item half"><span class="info-label"><i class="el-icon-user" /> 创建人</span><span class="info-value">{{ showView.name }}</span></div>
            <div class="info-item half"><span class="info-label"><i class="el-icon-phone" /> 联系方式</span><span class="info-value">{{ showView.phone }}</span></div>
          </div>
          <div class="info-item"><span class="info-label"><i class="el-icon-date" /> 发布时间</span><span class="info-value">{{ showView.releaseDate }}</span></div>
        </div>
      </div>
      <div slot="footer"><el-button @click="dialogShowView = false">关 闭</el-button></div>
    </el-dialog>

    <!-- ===== 留言弹窗 ===== -->
    <el-dialog :title="'留言：' + (dialogType === 'lost' ? '失物' : '招领')" :visible.sync="dialogFormVisible" @close="handleClose()">
      <el-form><el-form-item label="内容" :label-width="formLabelWidth"><el-input v-model="content" type="textarea" :rows="4" /></el-form-item></el-form>
      <div slot="footer"><el-button @click="dialogFormVisible = false">取 消</el-button><el-button type="primary" @click="addContact">确 定</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  data() {
    return {
      stats: { lostCount: 0, foundCount: 0, userCount: 0, contactCount: 0 },
      LostList: [], foundList: [], notice: {},
      showView: {}, content: '', formLabelWidth: '100px',
      dialogShowView: false, dialogFormVisible: false,
      contactId: '', dialogType: 'lost',
      data: { lostID: '', foundID: '', userID: '', content: '' },
    }
  },
  created() { this.getData() },
  methods: {
    handleClose() { this.data = { lostID: '', foundID: '', userID: '', content: '' }; this.content = '' },
    addContact() {
      if (!this.content.trim()) { this.$message.warning('请输入留言内容'); return }
      this.data.content = this.content
      request.post("/main/addContact", JSON.stringify(this.data), { headers: { 'Content-Type': 'application/json' } }).then(() => {
        this.$notify({ title: '成功', message: '留言成功', type: 'success', offset: 55 }); this.dialogFormVisible = false
      })
    },
    showContact(id, type) {
      this.dialogType = type
      this.data = { lostID: type === 'lost' ? id : '', foundID: type === 'found' ? id : '', userID: localStorage.getItem('userID') }
      this.dialogFormVisible = true
    },
    handelView(row) { request.get("/main/getLost", { params: { id: row.id } }).then(res => { this.showView = res.data.data.rows[0]; this.showView.itemPhoto = `/main/download?name=${this.showView.itemPhoto}`; this.dialogShowView = true }) },
    handelFoundView(row) { request.get("/main/getFound", { params: { id: row.id } }).then(res => { this.showView = res.data.data.rows[0]; this.showView.itemPhoto = `/main/download?name=${this.showView.itemPhoto}`; this.dialogShowView = true }) },
    handleLost() { this.$router.push('/UserIndex/UserLostHome') },
    handleFound() { this.$router.push('/UserIndex/UserFoundHome') },
    getData() {
      request.get("/main/getLost", { params: { page: 1, count: 4, statusID: 2 } }).then(res => {
        this.LostList = res.data.data.rows; this.stats.lostCount = res.data.data.total
        this.LostList.forEach(item => { item.itemPhoto = `/main/download?name=${item.itemPhoto}` })
      }).catch(() => {})
      request.get("/main/getFound", { params: { page: 1, count: 4, statusID: 4 } }).then(res => {
        this.foundList = res.data.data.rows; this.stats.foundCount = res.data.data.total
        this.foundList.forEach(item => { item.itemPhoto = `/main/download?name=${item.itemPhoto}` })
      }).catch(() => {})
      request.get("/main/getNoticeAll", { params: { page: 1, count: 1 } }).then(res => { this.notice = res.data.data.rows[0] || {} }).catch(() => {})
      request.get("/main/getUserAll", { params: { page: 1, count: 1 } }).then(res => { this.stats.userCount = res.data.data.total || 0 }).catch(() => {})
      request.get("/main/getContact", { params: { page: 1, count: 1 } }).then(res => { this.stats.contactCount = res.data.data.total || 0 }).catch(() => {})
    },
  },
}
</script>

<style scoped>
/* ===== Hero 区域 ===== */
.hero {
  background: linear-gradient(135deg, #409EFF 0%, #1a5dc7 50%, #0d3b8e 100%);
  margin: -20px 0 0;
  padding: 60px 40px 70px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute;
  width: 600px; height: 600px;
  border-radius: 50%;
  background: rgba(255,255,255,0.03);
  top: -200px; right: -150px;
}
.hero::after {
  content: '';
  position: absolute;
  width: 400px; height: 400px;
  border-radius: 50%;
  background: rgba(255,255,255,0.04);
  bottom: -150px; left: -100px;
}
.hero-content { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
.hero-title { color: #fff; font-size: 36px; font-weight: 700; margin: 0 0 14px; letter-spacing: 2px; }
.hero-desc { color: rgba(255,255,255,0.8); font-size: 16px; margin: 0 0 28px; line-height: 1.6; }
.hero-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.hero-actions .el-button { padding: 12px 28px; font-size: 15px; }

/* ===== 数据统计 ===== */
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  max-width: 900px;
  margin: -30px auto 0;
  position: relative;
  z-index: 2;
  padding: 0 20px;
}
.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: transform 0.2s;
}
.stat-card:hover { transform: translateY(-3px); }
.stat-icon {
  width: 48px; height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.stat-body { display: flex; flex-direction: column; }
.stat-num { font-size: 24px; font-weight: 700; color: #303133; line-height: 1.2; }
.stat-label { font-size: 13px; color: #909399; margin-top: 2px; }

/* ===== 公告栏 ===== */
.notice-bar {
  max-width: 900px; margin: 40px auto 0;
  background: #fff; border-radius: 12px; padding: 14px 22px;
  display: flex; align-items: center; gap: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  border-left: 4px solid #409EFF;
}
.notice-bell { font-size: 18px; color: #E6A23C; flex-shrink: 0; }
.notice-text { font-size: 14px; color: #606266; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ===== 双栏卡片区 ===== */
.main-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 1100px;
  margin: 30px auto 40px;
  padding: 0 20px;
}
.section-panel {
  background: #fff;
  border-radius: 16px;
  padding: 20px 24px 16px;
  box-shadow: 0 2px 14px rgba(0,0,0,0.05);
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 600;
  color: #303133;
}
.dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.dot-blue { background: #409EFF; }
.dot-green { background: #67C23A; }

/* ===== 物品卡片网格 ===== */
.lost-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.item-card {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.25s;
  border: 1px solid #f0f0f0;
}
.item-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); border-color: #e0e0e0; }
.item-img-wrap { position: relative; height: 160px; overflow: hidden; background: #f5f5f5; }
.item-img { width: 100%; height: 100%; transition: transform 0.3s; }
.item-card:hover .item-img { transform: scale(1.04); }
.img-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 36px; color: #c0c4cc; }
.item-badge {
  position: absolute; top: 8px; left: 8px;
  padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; color: #fff;
}
.badge-lost { background: rgba(64,158,255,0.85); }
.badge-found { background: rgba(103,194,58,0.85); }
.item-info { padding: 12px 14px; }
.item-title { margin: 0 0 4px; font-size: 14px; font-weight: 600; color: #303133; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.item-date { margin: 0; font-size: 12px; color: #c0c4cc; }
.item-actions { display: flex; gap: 4px; margin-top: 6px; padding-top: 6px; border-top: 1px solid #f5f5f5; }
.empty-placeholder { text-align: center; padding: 40px 20px; color: #c0c4cc; grid-column: span 2; }
.empty-placeholder i { font-size: 36px; } .empty-placeholder p { margin: 8px 0 0; font-size: 14px; }

/* ===== 响应式 ===== */
@media (max-width: 992px) {
  .stats { grid-template-columns: repeat(2, 1fr); }
  .main-sections { grid-template-columns: 1fr; max-width: 600px; }
  .hero { padding: 50px 24px 60px; }
  .hero-title { font-size: 28px; }
}
@media (max-width: 768px) {
  .hero { padding: 40px 20px 50px; }
  .hero-title { font-size: 24px; }
  .hero-desc { font-size: 14px; }
  .hero-actions .el-button { padding: 10px 20px; font-size: 14px; }
  .stats { margin-top: -25px; gap: 10px; }
  .stat-card { padding: 14px 12px; }
  .stat-num { font-size: 20px; }
  .lost-grid { grid-template-columns: 1fr; }
  .item-img-wrap { height: 180px; }
}
@media (max-width: 480px) {
  .hero { padding: 36px 16px 44px; }
  .hero-title { font-size: 20px; letter-spacing: 1px; }
  .hero-desc { font-size: 13px; display: block; }
  .stats { grid-template-columns: 1fr 1fr; gap: 8px; padding: 0 10px; }
  .stat-card { gap: 8px; }
  .stat-icon { width: 38px; height: 38px; font-size: 18px; }
  .stat-num { font-size: 18px; }
  .main-sections { padding: 0 10px; }
}
</style>
