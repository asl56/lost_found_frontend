<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
/* ===== 全局基础 ===== */
#app {
  font-family: 'PingFang SC', 'Microsoft YaHei', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #f5f7fa;
  min-height: 100vh;
}

/* ===== 全局弹窗美化 ===== */
.el-dialog {
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15) !important;
}
.el-dialog__header {
  background: linear-gradient(135deg, #409EFF 0%, #2d6cdf 100%);
  padding: 20px 28px !important;
  margin: 0 !important;
}
.el-dialog__title {
  color: #fff !important;
  font-size: 17px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px;
}
.el-dialog__headerbtn {
  top: 18px !important;
  right: 20px !important;
}
.el-dialog__headerbtn .el-dialog__close {
  color: rgba(255,255,255,0.8) !important;
  font-size: 20px !important;
  font-weight: bold;
  transition: all 0.2s;
}
.el-dialog__headerbtn .el-dialog__close:hover {
  color: #fff !important;
  transform: rotate(90deg);
}
.el-dialog__body {
  padding: 28px 30px 20px !important;
}
.el-dialog__footer {
  padding: 12px 30px 24px !important;
  border-top: 1px solid #f0f0f0;
}
/* 弹窗底部按钮 */
.el-dialog__footer .el-button {
  min-width: 90px;
  border-radius: 20px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
}
.el-dialog__footer .el-button--primary {
  background: linear-gradient(135deg, #409EFF 0%, #2d6cdf 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(64,158,255,0.35);
}
.el-dialog__footer .el-button--primary:hover {
  box-shadow: 0 6px 18px rgba(64,158,255,0.45);
  transform: translateY(-1px);
}

/* ===== 弹窗内表单美化 ===== */
.el-dialog .el-form-item__label {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}
.el-dialog .el-input__inner {
  border-radius: 10px;
  border: 1.5px solid #e8e8e8;
  padding: 12px 16px;
  transition: all 0.25s;
}
.el-dialog .el-input__inner:focus,
.el-dialog .el-input__inner:hover {
  border-color: #409EFF;
  box-shadow: 0 0 0 3px rgba(64,158,255,0.08);
}
.el-dialog .el-textarea__inner {
  border-radius: 10px;
  border: 1.5px solid #e8e8e8;
  padding: 12px 16px;
  transition: all 0.25s;
  font-size: 14px;
  line-height: 1.6;
}
.el-dialog .el-textarea__inner:focus,
.el-dialog .el-textarea__inner:hover {
  border-color: #409EFF;
  box-shadow: 0 0 0 3px rgba(64,158,255,0.08);
}
.el-dialog .el-select .el-input__inner {
  border-radius: 10px;
}
.el-dialog .el-date-editor .el-input__inner {
  border-radius: 10px;
}

/* ===== 弹窗内上传组件美化 ===== */
.el-dialog .avatar-uploader .el-upload {
  border: 2px dashed #d9d9d9;
  border-radius: 14px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
}
.el-dialog .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
  background: rgba(64,158,255,0.03);
}
.el-dialog .avatar {
  width: 100%;
  max-height: 220px;
  object-fit: contain;
  border-radius: 10px;
  display: block;
}
.el-dialog .avatar-uploader-icon {
  font-size: 32px;
  color: #c0c4cc;
  width: 148px !important;
  height: 148px !important;
  line-height: 148px !important;
  text-align: center;
  border: none !important;
  transition: all 0.3s;
}
.el-dialog .avatar-uploader-icon:hover {
  color: #409EFF;
}

/* ===== 全局通知美化 ===== */
.el-notification {
  border-radius: 14px !important;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12) !important;
}

/* ===== 全局消息提示美化 ===== */
.el-message {
  border-radius: 10px !important;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
}

/* ===== 详情弹窗卡片式布局 ===== */
.detail-hero {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 20px;
  background: #f0f2f5;
}
.detail-img {
  width: 100%;
  max-height: 280px;
  object-fit: cover;
  display: block;
}
.detail-status-tag {
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  backdrop-filter: blur(10px);
  letter-spacing: 0.5px;
}
.tag-active { background: rgba(64,158,255,0.85); }
.tag-done { background: rgba(103,194,58,0.85); }
.tag-audit { background: rgba(230,162,60,0.85); }
.tag-reject { background: rgba(245,108,108,0.85); }

.detail-body { padding: 0 4px; }
.detail-title {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 20px 0;
  letter-spacing: 0.5px;
}
.detail-info-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.info-item {
  background: #f8f9fb;
  border-radius: 12px;
  padding: 14px 18px;
}
.info-item .info-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #909399;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 6px;
}
.info-item .info-label i { font-size: 14px; color: #409EFF; }
.info-item .info-value {
  font-size: 15px;
  color: #303133;
  font-weight: 500;
  margin: 0;
  line-height: 1.5;
}
.info-row {
  display: flex;
  gap: 12px;
}
.info-item.half {
  flex: 1;
  min-width: 0;
}
</style>
