<template>
  <div class="lost-home">
    <!-- 顶部横幅 -->
    <div class="page-banner">
      <div class="banner-content">
        <h1 class="banner-title">失物招领</h1>
        <p class="banner-subtitle">发现遗失物品？在这里查找或发布信息</p>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <el-form :inline="true" :model="formInline" class="search-form">
        <el-form-item>
          <el-input
            v-model="formInline.title"
            placeholder="搜索失物标题..."
            clearable
            prefix-icon="el-icon-search"
            size="medium"
            class="search-input"
            @input="handleSearchInput"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="formInline.date"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            size="medium"
            @change="handleSearchInput"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="formInline.name"
            filterable
            placeholder="创建人"
            clearable
            size="medium"
            @change="handleSearchInput"
          >
            <el-option
              v-for="item in nameList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" :loading="loading" @click="getData">查询</el-button>
          <el-button size="medium" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作栏 -->
    <div class="toolbar">
      <span class="result-count">共 <b>{{ total }}</b> 条记录</span>
      <el-button type="primary" icon="el-icon-plus" size="small" round @click="dialogFormVisible = true">发布失物</el-button>
    </div>

    <!-- 卡片网格 -->
    <div v-loading="loading" element-loading-text="正在加载数据..." class="card-grid-wrapper">
      <!-- 错误提示 -->
      <div v-if="errorMessage" class="error-box">
        <i class="el-icon-warning" />
        <span>{{ errorMessage }}</span>
        <el-button type="text" @click="getData">重试</el-button>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!loading && tableData.length === 0" class="empty-box">
        <i class="el-icon-folder-opened" />
        <p>暂无失物信息</p>
        <span>点击"发布失物"按钮添加第一条记录吧</span>
      </div>

      <!-- 卡片网格 -->
      <div v-else class="card-grid">
        <div
          v-for="item in tableData"
          :key="item.id"
          class="lost-card"
          @click="handelView(item)"
        >
          <div class="card-image">
            <el-image
              :src="item.itemPhoto"
              fit="cover"
              class="card-img"
              lazy
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            <span class="card-status" :class="item.status === '已找到' ? 'status-done' : 'status-active'">
              {{ item.status }}
            </span>
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-meta">
              <i class="el-icon-user" />
              <span>{{ item.name }}</span>
              <span class="meta-divider">·</span>
              <i class="el-icon-date" />
              <span>{{ item.releaseDate }}</span>
            </p>
          </div>
          <div class="card-footer">
            <el-button type="primary" plain size="mini" round icon="el-icon-chat-line-round" @click.stop="showContact(item.id)">联系</el-button>
            <el-button type="info" plain size="mini" round icon="el-icon-view" @click.stop="handelView(item)">详情</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrap">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[8, 16, 24, 32]"
        :page-size="page.count"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      title="添加失物"
      :visible.sync="dialogFormVisible"
      width="500px"
      @close="handleClose"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="rules"
        style="margin: 0;"
      >
        <el-form-item
          label="物品图片"
          :label-width="formLabelWidth"
        >
          <el-upload
            class="avatar-uploader"
            action="/main/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="imageUrl"
              :src="imageUrl"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
              style="display: flex;justify-content: center;align-items: center;"
            />
          </el-upload>
        </el-form-item>

        <el-form-item
          label="标题"
          :label-width="formLabelWidth"
          prop="title"
        >
          <el-input
            v-model="addForm.title"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="描述"
          :label-width="formLabelWidth"
          prop="description"
        >
          <el-input
            v-model="addForm.description"
            type="textarea"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="手机号"
          :label-width="formLabelWidth"
          prop="phone"
        >
          <el-input
            v-model="addForm.phone"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="addLost('addForm')"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="详细信息"
      :visible.sync="dialogShowView"
      width="500px"
      @close="handleClose"
    >
      <el-form
        :model="showView"
        style="margin: 0;"
      >
        <el-form-item
          label="物品图片"
          :label-width="formLabelWidth"
        >
          <img
            :src="showView.itemPhoto"
            class="avatar"
          >
        </el-form-item>

        <el-form-item
          label="标题"
          :label-width="formLabelWidth"
          prop="title"
        >
          <el-input
            v-model="showView.title"
            autocomplete="off"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          label="描述"
          :label-width="formLabelWidth"
          prop="description"
        >
          <el-input
            v-model="showView.description"
            type="textarea"
            autocomplete="off"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          label="联系方式"
          :label-width="formLabelWidth"
          prop="phone"
        >
          <el-input
            v-model="showView.phone"
            autocomplete="off"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          label="创建人"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="showView.name"
            autocomplete="off"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          label="创建时间"
          :label-width="formLabelWidth"
          prop="phone"
        >
          <el-input
            v-model="showView.releaseDate"
            autocomplete="off"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          label="状态"
          :label-width="formLabelWidth"
          prop="phone"
        >
          <el-input
            v-model="showView.status"
            autocomplete="off"
            :disabled="true"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogShowView = false"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="留言"
      :visible.sync="lostDialogFormVisible"
      @close="handleClose()"
    >
      <el-form>
        <el-form-item
          label="内容"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="content"
            type="textarea"
            autosize
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="lostDialogFormVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="addContact"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  data() {
    return {

      dialogShowView: false,

      data: {
        lostID: '',
        userID: '',
        content: '',
      },
      content: '',
      lostDialogFormVisible: false,
      addForm: {
        userID: '',
        title: '',
        description: '',
        phone: '',
        itemPhoto: '',
      },
      formLabelWidth: '120px',
      imageUrl: '',
      dialogFormVisible: false,

      updateForm: {},
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        ItemPhoto: [
          { required: true, message: '请上传物品图片', trigger: 'blur' }
        ],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }, { pattern: /^1[345789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }],
        description: [{ required: true, message: '请输入物品描述', trigger: 'blur' }, { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' }],
        statusID: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],

      },
      id: '',
      formInline: {
        title: '',
        name: '',
        date: '',
      },
      nameList: [],
      currentPage: 1,
      total: 0,
      page: {
        page: 1,
        count: 8,
      },
      tableData: [],
      statusList: [],
      showView: {},
      loading: false,
      errorMessage: '',
      searchTimer: null,
    }
  },
  created() {
    this.id = localStorage.getItem("userID");
    this.getData();
  },
  mounted() {
    
  },
  beforeDestroy() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
  },
  methods: {
    handleSearchInput() {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }
      this.searchTimer = setTimeout(() => {
        this.page.page = 1
        this.getData()
      }, 350)
    },
    showContact(id) {
      this.data = {
        lostID: id,
        userID: localStorage.getItem('userID'),
        content: this.content
      }
      this.lostDialogFormVisible = true
    },
    addContact() {
      this.data.content = this.content
      request.post("/main/addContact", JSON.stringify(this.data), {
        headers: { 'Content-Type': 'application/json' }
      }).then(() => {
        this.$notify({
          title: '成功',
          message: '留言成功',
          type: 'success',
          offset: 55,
        })
        this.lostDialogFormVisible = false
      })
    },
    handelView(row) {
      request.get("/main/getLost", { params: { id: row.id } }).then(res => {
        this.showView = res.data.data.rows[0];
        this.showView.itemPhoto = `/main/download?name=${this.showView.itemPhoto}`;
        this.dialogShowView = true;
      })
    },
    addLost(addForm) {
      this.$refs[addForm].validate((valid) => {
        if (valid) {
          this.addForm.userID = this.id
          request.post("/main/addLost", JSON.stringify(this.addForm), {
            headers: {
              "Content-Type": "application/json",
            }
          }).then(() => {
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              offset: 55,
            });
            this.dialogFormVisible = false
            this.getData()
          })
        }
      })
    },
    handleUpdateSuccess(res, file) {
      this.imageUrl = `/main/download?name=${file.name}`;
      this.updateForm.itemPhoto = file.name;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = `/main/download?name=${file.name}`;
      this.addForm.itemPhoto = file.name;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    handleReset() {
      this.formInline = {
        title: '',
        name: '',
        date: '',
      };
      this.page = {
        page: 1,
        count: 8,
      };
      this.getData()
    },
    handleClose() {
      this.imageUrl = '';
      this.addForm = {
        title: '',
        description: '',
        phone: '',
        itemPhoto: '',
      };
      this.content = '';
    },


    handleSizeChange(val) { //分页
      this.page.count = val;
      this.getData();
    },
    handleCurrentChange(val) {//分页
      this.page.page = val
      this.getData();
    },
    getData() {//初始化数据
      this.loading = true
      this.errorMessage = ''
      request.get("/main/getLost", { params: { page: this.page.page, count: this.page.count, title: this.formInline.title, releaseDate: this.formInline.date, userID: this.formInline.name, statusID: 2 } }).then(res => {
        this.total = res.data.data.total;
        this.tableData = res.data.data.rows
        if (this.tableData.length < 1 && this.page.page > 1) {
          this.page.page -= 1;
          this.getData()
          return;
        }
        for (let index = 0; index < this.tableData.length; index++) {
          this.tableData[index].itemPhoto = `/main/download?name=${this.tableData[index].itemPhoto}`;
        }
      }).catch(() => {
        this.tableData = []
        this.total = 0
        this.errorMessage = '数据加载失败，请稍后重试'
      }).finally(() => {
        this.loading = false
      });
      request.get("/main/getUser").then(res => {
        if (this.nameList != null || this.nameList.length > 1)
          this.nameList = [];
        for (let index = 0; index < res.data.data.rows.length; index++) {
          this.nameList.push(res.data.data.rows[index]);
        }
      })
      request.get("/main/getLostStatus").then(res => {
        this.statusList = res.data.data
      })
    }
  },
}
</script>
<style scoped>
/* ===== 页面整体 ===== */
.lost-home {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

/* ===== 顶部 Banner ===== */
.page-banner {
  background: linear-gradient(135deg, #409EFF 0%, #2d6cdf 100%);
  border-radius: 16px;
  padding: 40px 48px;
  margin-bottom: 24px;
  color: #fff;
  position: relative;
  overflow: hidden;
}
.page-banner::after {
  content: '';
  position: absolute;
  right: -40px;
  top: -40px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
}
.page-banner::before {
  content: '';
  position: absolute;
  right: 80px;
  bottom: -60px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
}
.banner-content {
  position: relative;
  z-index: 1;
}
.banner-title {
  margin: 0 0 8px 0;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 1px;
}
.banner-subtitle {
  margin: 0;
  font-size: 14px;
  opacity: 0.85;
}

/* ===== 搜索栏 ===== */
.search-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px 4px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.search-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.search-input {
  width: 260px;
}

/* ===== 工具栏 ===== */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.result-count {
  color: #909399;
  font-size: 14px;
}
.result-count b {
  color: #409EFF;
  font-weight: 600;
}

/* ===== 卡片网格 ===== */
.card-grid-wrapper {
  min-height: 300px;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
@media (max-width: 1200px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 900px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .card-grid { grid-template-columns: 1fr; }
}

/* ===== 单张卡片 ===== */
.lost-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
}
.lost-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.12);
}
.card-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f0f2f5;
}
.card-img {
  width: 100%;
  height: 100%;
  transition: transform 0.4s ease;
}
.lost-card:hover .card-img {
  transform: scale(1.05);
}
.image-slot {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #c0c4cc;
}
.card-status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
}
.status-active {
  background: rgba(64,158,255,0.85);
  color: #fff;
}
.status-done {
  background: rgba(103,194,58,0.85);
  color: #fff;
}
.card-body {
  padding: 16px 18px 12px;
  flex: 1;
}
.card-title {
  margin: 0 0 10px 0;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-meta {
  margin: 0;
  font-size: 13px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}
.card-meta i {
  font-size: 14px;
}
.meta-divider {
  margin: 0 4px;
}
.card-footer {
  padding: 10px 18px 16px;
  display: flex;
  gap: 8px;
  border-top: 1px solid #f5f5f5;
}

/* ===== 错误 / 空状态 ===== */
.error-box, .empty-box {
  text-align: center;
  padding: 80px 20px;
  color: #909399;
}
.error-box i, .empty-box i {
  font-size: 56px;
  display: block;
  margin-bottom: 16px;
}
.error-box i { color: #F56C6C; }
.empty-box i { color: #dcdfe6; }
.empty-box p {
  margin: 0 0 8px 0;
  font-size: 15px;
  color: #606266;
  font-weight: 500;
}
.empty-box span {
  font-size: 13px;
}

/* ===== 分页 ===== */
.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

/* ===== 弹窗内图片 ===== */
.avatar {
  width: 100%;
  max-height: 250px;
  object-fit: contain;
  border-radius: 8px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
}
</style>