<template>
  <div class="my-contact">
    <div class="page-banner banner-contact">
      <div class="banner-content"><h1 class="banner-title">我的联系</h1><p class="banner-subtitle">管理你发出的联系消息</p></div>
    </div>

    <div class="search-section">
      <el-form :inline="true" :model="formInline" class="search-form">
        <el-form-item><el-input v-model="formInline.content" placeholder="搜索联系内容..." clearable prefix-icon="el-icon-search" size="medium" class="search-input" @input="handleSearchInput" /></el-form-item>
        <el-form-item><el-date-picker v-model="formInline.date" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" size="medium" @change="handleSearchInput" /></el-form-item>
        <el-form-item><el-button type="primary" size="medium" :loading="loading" @click="getData">查询</el-button><el-button size="medium" @click="handleReset">重置</el-button></el-form-item>
      </el-form>
    </div>

    <div class="toolbar"><span class="result-count">共 <b>{{ total }}</b> 条消息</span></div>

    <div v-loading="loading" class="contact-list">
      <div v-if="errorMessage" class="error-box"><i class="el-icon-warning" /><span>{{ errorMessage }}</span><el-button type="text" @click="getData">重试</el-button></div>
      <div v-else-if="!loading && tableData.length === 0" class="empty-box"><i class="el-icon-chat-line-round" /><p>暂无联系记录</p></div>
      <div v-else>
        <div v-for="item in tableData" :key="item.id" class="contact-card">
          <div class="contact-left">
            <el-image :src="item.itemPhoto" fit="cover" class="contact-img" lazy><div slot="error" class="img-placeholder"><i class="el-icon-picture-outline" /></div></el-image>
          </div>
          <div class="contact-body">
            <div class="contact-header">
              <span class="contact-name">{{ item.title }}</span>
              <el-tag size="small" type="info">{{ item.status }}</el-tag>
            </div>
            <p class="contact-meta"><i class="el-icon-user" /> 联系人：{{ item.name }} &nbsp; <i class="el-icon-phone" /> {{ item.phone }}</p>
            <p class="contact-content">{{ item.content }}</p>
            <span class="contact-time"><i class="el-icon-date" /> {{ item.contactTime }}</span>
          </div>
          <div class="contact-right">
            <el-popconfirm title="确定要删除该条留言吗？" @confirm="handleDelete(item)">
              <el-button slot="reference" type="danger" plain size="small" icon="el-icon-delete" circle />
            </el-popconfirm>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-wrap"><el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="page.count" layout="total, sizes, prev, pager, next, jumper" :total="total" background @size-change="handleSizeChange" @current-change="handleCurrentChange" /></div>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  data() { return {
    loading: false, errorMessage: '',
    id: '', formInline: { content: '', date: '' },
    currentPage: 1, total: 0, page: { page: 1, count: 10 }, tableData: [],
    searchTimer: null,
  }},
  created() { this.id = localStorage.getItem("userID"); this.getData(); },
  beforeDestroy() { if (this.searchTimer) clearTimeout(this.searchTimer); },
  methods: {
    handleSearchInput() { if (this.searchTimer) clearTimeout(this.searchTimer); this.searchTimer = setTimeout(() => { this.page.page = 1; this.getData(); }, 350); },
    handleDelete(row) { request.get("/main/deleteContact", { params: { id: row.id } }).then(() => { this.$notify({ title: '成功', message: '删除成功', type: 'success', offset: 55 }); this.getData(); }); },
    handleReset() { this.formInline = { content: '', date: '' }; this.page = { page: 1, count: 10 }; this.getData(); },
    handleSizeChange(val) { this.page.count = val; this.getData(); },
    handleCurrentChange(val) { this.page.page = val; this.getData(); },
    getData() {
      this.loading = true; this.errorMessage = '';
      request.get("/main/getContact", { params: { page: this.page.page, count: this.page.count, content: this.formInline.content, contactTime: this.formInline.date, userID: this.id } }).then(res => {
        this.total = res.data.data.total; var data = res.data.data.rows;
        if (data.length < 1 && this.page.page > 1) { this.page.page -= 1; this.getData(); return; }
        const userPromises = data.map((item, i) => { item.itemPhoto = `/main/download?name=${item.itemPhoto}`; return request.get("/main/getUser", { params: { id: item.itemsUserID } }).then(r => { data[i].name = r.data.data.rows[0].name; data[i].phone = r.data.data.rows[0].phone; }).catch(() => { data[i].name = '未知'; data[i].phone = '未知'; }); });
        Promise.all(userPromises).then(() => { this.tableData = data; this.loading = false; });
      }).catch(() => { this.tableData = []; this.total = 0; this.errorMessage = '数据加载失败'; this.loading = false; });
    }
  },
}
</script>

<style scoped>
.my-contact { max-width: 1000px; margin: 0 auto; padding: 0 20px 40px; }
.page-banner { border-radius: 16px; padding: 40px 48px; margin-bottom: 24px; color: #fff; position: relative; overflow: hidden; }
.banner-contact { background: linear-gradient(135deg, #909399 0%, #606266 100%); }
.page-banner::after { content: ''; position: absolute; right: -40px; top: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.1); }
.banner-content { position: relative; z-index: 1; }
.banner-title { margin: 0 0 8px 0; font-size: 26px; font-weight: 700; }
.banner-subtitle { margin: 0; font-size: 14px; opacity: 0.85; }
.search-section { background: #fff; border-radius: 12px; padding: 20px 24px 4px; margin-bottom: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.search-form { display: flex; flex-wrap: wrap; align-items: center; }
.search-input { width: 260px; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.result-count { color: #909399; font-size: 14px; } .result-count b { color: #909399; font-weight: 600; }
.contact-list { min-height: 200px; }
.contact-card { background: #fff; border-radius: 12px; padding: 20px; margin-bottom: 12px; display: flex; gap: 16px; align-items: flex-start; box-shadow: 0 1px 6px rgba(0,0,0,0.05); transition: all 0.2s ease; }
.contact-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-2px); }
.contact-left { flex-shrink: 0; }
.contact-img { width: 80px; height: 80px; border-radius: 10px; background: #f0f2f5; }
.img-placeholder { width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; font-size: 28px; color: #c0c4cc; }
.contact-body { flex: 1; min-width: 0; }
.contact-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.contact-name { font-size: 15px; font-weight: 600; color: #303133; }
.contact-meta { margin: 0 0 6px 0; font-size: 13px; color: #909399; }
.contact-content { margin: 0 0 6px 0; font-size: 14px; color: #606266; background: #f5f7fa; padding: 10px 14px; border-radius: 8px; line-height: 1.5; }
.contact-time { font-size: 12px; color: #c0c4cc; }
.contact-right { flex-shrink: 0; padding-top: 4px; }
.error-box, .empty-box { text-align: center; padding: 80px 20px; color: #909399; }
.error-box i, .empty-box i { font-size: 56px; display: block; margin-bottom: 16px; }
.error-box i { color: #F56C6C; } .empty-box i { color: #dcdfe6; }
.empty-box p { margin: 0; font-size: 15px; color: #606266; font-weight: 500; }
.pagination-wrap { display: flex; justify-content: center; margin-top: 24px; }
</style>
