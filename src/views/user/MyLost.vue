<template>
  <div class="my-lost">
    <div class="page-banner banner-mylost">
      <div class="banner-content">
        <h1 class="banner-title">我的失物</h1>
        <p class="banner-subtitle">管理你发布的失物信息</p>
      </div>
    </div>

    <div class="search-section">
      <el-form :inline="true" :model="formInline" class="search-form">
        <el-form-item>
          <el-input v-model="formInline.title" placeholder="搜索标题..." clearable prefix-icon="el-icon-search" size="medium" class="search-input" @input="handleSearchInput" />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="formInline.date" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" size="medium" @change="handleSearchInput" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" :loading="loading" @click="getData">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="toolbar">
      <span class="result-count">共 <b>{{ total }}</b> 条记录</span>
      <el-button type="primary" icon="el-icon-plus" size="small" round @click="dialogFormVisible = true">发布新失物</el-button>
    </div>

    <div v-loading="loading" element-loading-text="正在加载..." class="card-grid-wrapper">
      <div v-if="errorMessage" class="error-box"><i class="el-icon-warning" /><span>{{ errorMessage }}</span><el-button type="text" @click="getData">重试</el-button></div>
      <div v-else-if="!loading && tableData.length === 0" class="empty-box"><i class="el-icon-folder-opened" /><p>还没有发布过失物</p><span>点击上方按钮发布第一条吧</span></div>
      <div v-else class="card-grid">
        <div v-for="item in tableData" :key="item.id" class="my-card">
          <div class="card-image" @click="handelView(item)">
            <el-image :src="item.itemPhoto" fit="cover" class="card-img" lazy><div slot="error" class="image-slot"><i class="el-icon-picture-outline" /></div></el-image>
            <span class="card-status" :class="{ 'status-audit': item.status==='审核中', 'status-reject': item.status==='未通过', 'status-ok': item.status==='已找到' }">{{ item.status }}</span>
          </div>
          <div class="card-body" @click="handelView(item)">
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-desc">{{ item.description || '暂无描述' }}</p>
            <p class="card-meta"><i class="el-icon-date" /><span>{{ item.releaseDate }}</span></p>
          </div>
          <div class="card-footer">
            <el-button type="info" plain size="mini" round icon="el-icon-view" @click="handelView(item)">详情</el-button>
            <el-button type="warning" plain size="mini" round icon="el-icon-edit" @click="showEdit(item)">修改</el-button>
            <el-popconfirm title="确定要删除该条失物信息吗？" @confirm="handleDelete(item)">
              <el-button slot="reference" type="danger" plain size="mini" round icon="el-icon-delete">删除</el-button>
            </el-popconfirm>
            <el-button v-if="item.status==='未通过'" type="primary" plain size="mini" round icon="el-icon-refresh-right" @click="handleRefresh(item)">重发</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-wrap">
      <el-pagination :current-page="currentPage" :page-sizes="[8, 16, 24, 32]" :page-size="page.count" layout="total, sizes, prev, pager, next, jumper" :total="total" background @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 添加弹窗 -->
    <el-dialog title="添加失物" :visible.sync="dialogFormVisible" width="500px" @close="handleClose">
      <el-form ref="addForm" :model="addForm" :rules="rules" style="margin: 0;">
        <el-form-item label="物品图片" :label-width="formLabelWidth">
          <el-upload class="avatar-uploader" action="/main/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar"><i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="标题" :label-width="formLabelWidth" prop="title"><el-input v-model="addForm.title" /></el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="description"><el-input v-model="addForm.description" type="textarea" /></el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone"><el-input v-model="addForm.phone" /></el-form-item>
      </el-form>
      <div slot="footer"><el-button @click="handleClose">取 消</el-button><el-button type="primary" @click="addLost('addForm')">确 定</el-button></div>
    </el-dialog>

    <!-- 修改弹窗 -->
    <el-dialog title="修改失物信息" :visible.sync="dialogUpdateForm" width="500px" @close="handleClose">
      <el-form ref="updateForm" :model="updateForm" :rules="rules" style="margin: 0;">
        <el-form-item label="物品图片" :label-width="formLabelWidth">
          <el-upload class="avatar-uploader" action="/main/upload" :show-file-list="false" :on-success="handleUpdateSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar"><i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="标题" :label-width="formLabelWidth" prop="title"><el-input v-model="updateForm.title" /></el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="description"><el-input v-model="updateForm.description" type="textarea" /></el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone"><el-input v-model="updateForm.phone" /></el-form-item>
        <el-form-item v-if="updateForm.statusID != 8 && updateForm.statusID != 7" label="状态" :label-width="formLabelWidth" prop="statusID">
          <el-select v-model="updateForm.statusID" placeholder="请选择" style="width:100%"><el-option v-for="item in statusList" :key="item.id" :label="item.status" :value="item.id" /></el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"><el-button @click="handleClose">取 消</el-button><el-button type="primary" @click="editLost('updateForm')">确 定</el-button></div>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog title="详细信息" :visible.sync="dialogShowView" width="500px" @close="handleClose">
      <el-form :model="showView"><el-form-item label="物品图片" :label-width="formLabelWidth"><img :src="showView.itemPhoto" class="avatar"></el-form-item>
        <el-form-item label="标题" :label-width="formLabelWidth"><el-input v-model="showView.title" :disabled="true" /></el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth"><el-input v-model="showView.description" type="textarea" :disabled="true" /></el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth"><el-input v-model="showView.phone" :disabled="true" /></el-form-item>
        <el-form-item label="创建人" :label-width="formLabelWidth"><el-input v-model="showView.name" :disabled="true" /></el-form-item>
        <el-form-item label="创建时间" :label-width="formLabelWidth"><el-input v-model="showView.releaseDate" :disabled="true" /></el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth"><el-input v-model="showView.status" :disabled="true" /></el-form-item>
      </el-form>
      <div slot="footer"><el-button type="primary" @click="dialogShowView = false">确 定</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  data() { return {
    dialogShowView: false, dialogUpdateForm: false, loading: false, errorMessage: '',
    addForm: { userID: '', title: '', description: '', phone: '', itemPhoto: '' },
    formLabelWidth: '120px', imageUrl: '', dialogFormVisible: false, updateForm: {},
    rules: {
      title: [{ required: true, message: '请输入标题', trigger: 'blur' }, { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
      ItemPhoto: [{ required: true, message: '请上传物品图片', trigger: 'blur' }],
      phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }, { pattern: /^1[345789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }],
      description: [{ required: true, message: '请输入物品描述', trigger: 'blur' }, { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' }],
      statusID: [{ required: true, message: '请选择状态', trigger: 'blur' }],
    },
    id: '', formInline: { title: '', date: '' }, currentPage: 1, total: 0,
    page: { page: 1, count: 8 }, tableData: [], statusList: [], showView: {}, searchTimer: null,
  }},
  created() { this.id = localStorage.getItem("userID"); this.getData(); },
  beforeDestroy() { if (this.searchTimer) clearTimeout(this.searchTimer); },
  methods: {
    handleSearchInput() { if (this.searchTimer) clearTimeout(this.searchTimer); this.searchTimer = setTimeout(() => { this.page.page = 1; this.getData(); }, 350); },
    editLost(form) { this.$refs[form].validate(v => { if (v) { request.post("/main/editLost", JSON.stringify(this.updateForm), { headers: { "Content-Type": "application/json" } }).then(() => { this.$notify({ title: '成功', message: '修改成功', type: 'success', offset: 55 }); this.dialogUpdateForm = false; this.getData(); }); } }); },
    handleRefresh(row) { request.post("/main/editLost", JSON.stringify({ id: row.id, statusID: 7 }), { headers: { "Content-Type": "application/json" } }).then(() => { this.$notify({ title: '成功', message: '已重新提交审核', type: 'success', offset: 55 }); this.getData(); }); },
    showEdit(row) { request.get("/main/getLost", { params: { id: row.id } }).then(res => { this.updateForm = res.data.data.rows[0]; this.imageUrl = `/main/download?name=${this.updateForm.itemPhoto}`; this.dialogUpdateForm = true; }); },
    handelView(row) { request.get("/main/getLost", { params: { id: row.id } }).then(res => { this.showView = res.data.data.rows[0]; this.showView.itemPhoto = `/main/download?name=${this.showView.itemPhoto}`; this.dialogShowView = true; }); },
    addLost(form) { this.$refs[form].validate(v => { if (v) { this.addForm.userID = this.id; request.post("/main/addLost", JSON.stringify(this.addForm), { headers: { "Content-Type": "application/json" } }).then(() => { this.$notify({ title: '成功', message: '添加成功', type: 'success', offset: 55 }); this.dialogFormVisible = false; this.getData(); }); } }); },
    handleUpdateSuccess(res, file) { this.imageUrl = `/main/download?name=${file.name}`; this.updateForm.itemPhoto = file.name; },
    handleAvatarSuccess(res, file) { this.imageUrl = `/main/download?name=${file.name}`; this.addForm.itemPhoto = file.name; },
    beforeAvatarUpload(file) { const isImg = file.type.startsWith('image/'); const isLt2M = file.size / 1024 / 1024 < 2; if (!isImg) this.$message.error('请上传图片格式文件!'); if (!isLt2M) this.$message.error('图片大小不能超过 2MB!'); return isImg && isLt2M; },
    handleReset() { this.formInline = { title: '', date: '' }; this.page = { page: 1, count: 8 }; this.getData(); },
    handleClose() { this.imageUrl = ''; this.addForm = { title: '', description: '', phone: '', itemPhoto: '' }; this.dialogUpdateForm = false; },
    handleDelete(row) { request.get("/main/deleteLost", { params: { id: row.id } }).then(() => { this.$notify({ title: '成功', message: '删除成功', type: 'success', offset: 55 }); this.getData(); }); },
    handleSizeChange(val) { this.page.count = val; this.getData(); },
    handleCurrentChange(val) { this.page.page = val; this.getData(); },
    getData() {
      this.loading = true; this.errorMessage = '';
      request.get("/main/getLost", { params: { page: this.page.page, count: this.page.count, title: this.formInline.title, releaseDate: this.formInline.date, userID: this.id } }).then(res => {
        this.total = res.data.data.total; this.tableData = res.data.data.rows;
        if (this.tableData.length < 1 && this.page.page > 1) { this.page.page -= 1; this.getData(); return; }
        for (let i = 0; i < this.tableData.length; i++) this.tableData[i].itemPhoto = `/main/download?name=${this.tableData[i].itemPhoto}`;
      }).catch(() => { this.tableData = []; this.total = 0; this.errorMessage = '数据加载失败，请稍后重试'; }).finally(() => { this.loading = false; });
      request.get("/main/getLostStatus").then(res => { this.statusList = res.data.data; });
    }
  },
}
</script>

<style scoped>
.my-lost { max-width: 1300px; margin: 0 auto; padding: 0 20px 40px; }
.page-banner { border-radius: 16px; padding: 40px 48px; margin-bottom: 24px; color: #fff; position: relative; overflow: hidden; }
.banner-mylost { background: linear-gradient(135deg, #E6A23C 0%, #b88230 100%); }
.page-banner::after { content: ''; position: absolute; right: -40px; top: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.1); }
.page-banner::before { content: ''; position: absolute; right: 80px; bottom: -60px; width: 140px; height: 140px; border-radius: 50%; background: rgba(255,255,255,0.06); }
.banner-content { position: relative; z-index: 1; }
.banner-title { margin: 0 0 8px 0; font-size: 26px; font-weight: 700; }
.banner-subtitle { margin: 0; font-size: 14px; opacity: 0.85; }
.search-section { background: #fff; border-radius: 12px; padding: 20px 24px 4px; margin-bottom: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.search-form { display: flex; flex-wrap: wrap; align-items: center; }
.search-input { width: 260px; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.result-count { color: #909399; font-size: 14px; } .result-count b { color: #E6A23C; font-weight: 600; }
.card-grid-wrapper { min-height: 300px; }
.card-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
@media (max-width: 1200px) { .card-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 900px)  { .card-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px)  { .card-grid { grid-template-columns: 1fr; } }
.my-card { background: #fff; border-radius: 14px; overflow: hidden; transition: all 0.3s ease; box-shadow: 0 2px 10px rgba(0,0,0,0.06); display: flex; flex-direction: column; }
.my-card:hover { transform: translateY(-4px); box-shadow: 0 10px 24px rgba(0,0,0,0.10); }
.card-image { position: relative; width: 100%; height: 180px; overflow: hidden; background: #f0f2f5; cursor: pointer; }
.card-img { width: 100%; height: 100%; transition: transform 0.4s ease; }
.my-card:hover .card-img { transform: scale(1.04); }
.image-slot { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 48px; color: #c0c4cc; }
.card-status { position: absolute; top: 10px; right: 10px; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; backdrop-filter: blur(10px); color: #fff; }
.status-audit { background: rgba(230,162,60,0.85); }
.status-reject { background: rgba(245,108,108,0.85); }
.status-ok { background: rgba(103,194,58,0.85); }
.card-body { padding: 14px 16px 8px; flex: 1; cursor: pointer; }
.card-title { margin: 0 0 6px 0; font-size: 15px; font-weight: 600; color: #303133; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.card-desc { margin: 0 0 8px 0; font-size: 13px; color: #909399; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.card-meta { margin: 0; font-size: 12px; color: #c0c4cc; display: flex; align-items: center; gap: 4px; }
.card-meta i { font-size: 13px; }
.card-footer { padding: 8px 12px 14px; display: flex; flex-wrap: wrap; gap: 6px; border-top: 1px solid #f5f5f5; }
.error-box, .empty-box { text-align: center; padding: 80px 20px; color: #909399; }
.error-box i, .empty-box i { font-size: 56px; display: block; margin-bottom: 16px; }
.error-box i { color: #F56C6C; } .empty-box i { color: #dcdfe6; }
.empty-box p { margin: 0 0 8px 0; font-size: 15px; color: #606266; font-weight: 500; } .empty-box span { font-size: 13px; }
.pagination-wrap { display: flex; justify-content: center; margin-top: 32px; }
.avatar { width: 100%; max-height: 250px; object-fit: contain; border-radius: 8px; }
.avatar-uploader-icon { font-size: 28px; color: #8c939d; width: 128px; height: 128px; border: 1px dashed #d9d9d9; border-radius: 8px; display: flex; justify-content: center; align-items: center; }
</style>
