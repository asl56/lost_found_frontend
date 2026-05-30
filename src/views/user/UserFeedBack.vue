<template>
  <div class="user-feedback">
    <div class="page-banner banner-feedback">
      <div class="banner-content"><h1 class="banner-title">意见反馈</h1><p class="banner-subtitle">留下你的宝贵意见，帮助我们做得更好</p></div>
    </div>

    <div class="feedback-layout">
      <div class="feedback-input-card">
        <h3 class="section-title"><i class="el-icon-edit" /> 写反馈</h3>
        <el-input v-model="textarea" type="textarea" :rows="8" placeholder="留下您宝贵的意见..." class="feedback-textarea" />
        <el-button type="primary" icon="el-icon-s-promotion" class="submit-btn" @click="addFeedBack">提交反馈</el-button>
      </div>

      <div class="feedback-list-panel">
        <h3 class="section-title"><i class="el-icon-chat-line-round" /> 大家的反馈</h3>
        <div v-loading="loading" class="feedback-list">
          <div v-if="!loading && tableData.length === 0" class="empty-box"><i class="el-icon-chat-round" /><p>暂无反馈</p></div>
          <div v-for="item in tableData" :key="item.id" class="feedback-card">
            <div class="fb-header">
              <el-avatar :src="item.avatar" :size="40" />
              <div class="fb-user">
                <span class="fb-name">{{ item.name }}</span>
                <span class="fb-date">{{ item.released }}</span>
              </div>
              <el-popconfirm v-if="item.userID == id" title="确定删除该条反馈吗？" @confirm="handleDelete(item.id)">
                <el-link slot="reference" :underline="false" icon="el-icon-delete" type="danger">删除</el-link>
              </el-popconfirm>
            </div>
            <div class="fb-content">{{ item.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  data() { return { textarea: '', id: '', tableData: [], loading: false }; },
  created() { this.id = localStorage.getItem('userID'); this.getData(); },
  methods: {
    handleDelete(id) { request.get("/main/deleteFeedBack", { params: { id } }).then(() => { this.$notify({ title: '成功', message: '删除成功', type: 'success', offset: 55 }); this.getData(); }); },
    getData() { this.loading = true; request.get("/main/getFeedBackAll").then(res => { this.tableData = res.data.data.rows; for (let i = 0; i < this.tableData.length; i++) this.tableData[i].avatar = `/main/download?name=${this.tableData[i].avatar}`; }).finally(() => { this.loading = false; }); },
    addFeedBack() { if (!this.textarea.trim()) { this.$message.warning('请输入反馈内容'); return; } request.post("/main/addFeedBack", JSON.stringify({ userID: this.id, content: this.textarea }), { headers: { 'Content-Type': 'application/json' } }).then(() => { this.$notify({ title: '成功', message: '反馈提交成功', type: 'success', offset: 55 }); this.textarea = ''; this.getData(); }); },
  },
}
</script>

<style scoped>
.user-feedback { max-width: 1100px; margin: 0 auto; padding: 0 20px 40px; }
.page-banner { border-radius: 16px; padding: 40px 48px; margin-bottom: 24px; color: #fff; position: relative; overflow: hidden; }
.banner-feedback { background: linear-gradient(135deg, #F56C6C 0%, #c03636 100%); }
.page-banner::after { content: ''; position: absolute; right: -40px; top: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.1); }
.banner-content { position: relative; z-index: 1; }
.banner-title { margin: 0 0 8px 0; font-size: 26px; font-weight: 700; }
.banner-subtitle { margin: 0; font-size: 14px; opacity: 0.85; }
.feedback-layout { display: flex; gap: 24px; align-items: flex-start; }
@media (max-width: 768px) { .feedback-layout { flex-direction: column; } }
.feedback-input-card { background: #fff; border-radius: 14px; padding: 28px; flex: 1; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.section-title { margin: 0 0 18px 0; font-size: 16px; font-weight: 600; color: #303133; display: flex; align-items: center; gap: 8px; }
.section-title i { color: #F56C6C; }
.feedback-textarea { margin-bottom: 16px; }
.submit-btn { width: 100%; }
.feedback-list-panel { background: #fff; border-radius: 14px; padding: 28px; flex: 2; box-shadow: 0 2px 12px rgba(0,0,0,0.06); max-height: 600px; overflow-y: auto; }
.feedback-list { min-height: 100px; }
.feedback-card { padding: 16px 0; border-bottom: 1px solid #f0f0f0; }
.feedback-card:last-child { border-bottom: none; }
.fb-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.fb-user { flex: 1; display: flex; flex-direction: column; }
.fb-name { font-size: 14px; font-weight: 500; color: #303133; }
.fb-date { font-size: 12px; color: #c0c4cc; }
.fb-content { font-size: 14px; color: #606266; line-height: 1.6; padding-left: 52px; }
.empty-box { text-align: center; padding: 40px 20px; color: #909399; }
.empty-box i { font-size: 40px; display: block; margin-bottom: 10px; color: #dcdfe6; }
.empty-box p { margin: 0; font-size: 14px; }
</style>
