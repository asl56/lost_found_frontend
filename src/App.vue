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

/* ================================================
   全局响应式布局 —— 适配所有屏幕尺寸
   ================================================ */

/* 全局盒模型统一 */
*, *::before, *::after { box-sizing: border-box; }
html { font-size: 16px; }
img, video, canvas { max-width: 100%; height: auto; }

/* ===== 平板横屏 (≤1200px) ===== */
@media (max-width: 1200px) {
  .page-banner { padding: 32px 36px !important; }
  .banner-title { font-size: 22px !important; }
  .banner-subtitle { font-size: 13px !important; }
  .search-input { width: 220px !important; }
  .toolbar { flex-wrap: wrap; gap: 10px; }
}

/* ===== 平板竖屏 (≤992px) ===== */
@media (max-width: 992px) {
  .page-banner { padding: 28px 30px !important; border-radius: 12px !important; }
  .banner-title { font-size: 20px !important; }
  .search-section { padding: 16px 18px 4px !important; }
  .search-form .el-form-item { margin-bottom: 14px !important; }
  .search-input { width: 200px !important; }
  .pagination-wrap { margin-top: 24px !important; }
  /* 详情弹窗信息行变垂直 */
  .info-row { flex-direction: column; gap: 8px; }
}

/* ===== 手机横屏 (≤768px) ===== */
@media (max-width: 768px) {
  #app { font-size: 14px; }
  .page-banner { padding: 22px 20px !important; border-radius: 10px !important; }
  .banner-title { font-size: 18px !important; }
  .banner-subtitle { font-size: 12px !important; display: none; }
  .page-banner::after, .page-banner::before { display: none; }
  .search-section { padding: 14px 14px 2px !important; border-radius: 10px !important; }
  .search-input { width: 100% !important; }
  .search-form { flex-direction: column !important; }
  .search-form .el-form-item { width: 100% !important; margin-right: 0 !important; margin-bottom: 12px !important; }
  .search-form .el-form-item .el-input,
  .search-form .el-form-item .el-select,
  .search-form .el-form-item .el-date-editor { width: 100% !important; }
  .toolbar { flex-direction: column; align-items: flex-start; gap: 12px; }
  .pagination-wrap { overflow-x: auto; }
  /* 弹窗在小屏全宽 */
  .el-dialog { width: 95% !important; margin-top: 5vh !important; border-radius: 12px !important; }
  .el-dialog__header { padding: 14px 18px !important; }
  .el-dialog__title { font-size: 15px !important; }
  .el-dialog__body { padding: 18px 16px 12px !important; }
  .el-dialog__footer { padding: 10px 16px 16px !important; }
  .el-dialog .el-input__inner { padding: 10px 14px; font-size: 14px; }
  .detail-img { max-height: 200px; }
  .detail-title { font-size: 17px; }
  .info-item { padding: 10px 14px; }
  .card-grid-wrapper { min-height: 200px; }
}

/* ===== 手机竖屏 (≤480px) ===== */
@media (max-width: 480px) {
  .page-banner { padding: 18px 16px !important; border-radius: 8px !important; margin-bottom: 14px !important; }
  .banner-title { font-size: 16px !important; letter-spacing: 0 !important; }
  .banner-content h1 { margin-bottom: 0 !important; }
  .search-section { padding: 12px 10px 0 !important; }
  .el-dialog { width: 98% !important; margin-top: 2vh !important; border-radius: 10px !important; }
  .el-dialog__body { padding: 14px 10px 8px !important; }
  .el-dialog__footer .el-button { min-width: 70px; padding: 8px 18px; font-size: 13px; }
  .detail-img { max-height: 160px; }
  .detail-title { font-size: 16px; margin-bottom: 14px; }
  .detail-info-grid { gap: 10px; }
  .card-grid { gap: 12px; }
  /* footer 按钮组允许换行 */
  .card-footer { flex-wrap: wrap; gap: 4px; }
  .card-footer .el-button { font-size: 11px; padding: 5px 10px; }
  .result-count { font-size: 12px; }
}

/* ===== 自适应容器 ===== */
.responsive-container {
  width: 100%;
  max-width: 1300px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 20px;
  padding-right: 20px;
}
@media (max-width: 768px) {
  .responsive-container { padding-left: 12px; padding-right: 12px; }
}
@media (max-width: 480px) {
  .responsive-container { padding-left: 8px; padding-right: 8px; }
}

/* 确保 el-table 在小屏可横向滚动 */
@media (max-width: 768px) {
  .el-table { font-size: 13px; }
  .el-table .cell { padding-left: 8px; padding-right: 8px; }
}

/* 面包屑响应式隐藏小屏 */
@media (max-width: 480px) {
  .el-breadcrumb { font-size: 12px; }
}

/* el-main padding 适配 */
@media (max-width: 768px) {
  .el-main { padding: 12px !important; }
}
</style>
