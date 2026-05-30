<template>
  <div class="admin-layout">
    <!-- 顶部栏 - flex布局 -->
    <header class="admin-header">
      <div class="header-left">
        <img src="../assets/img/LostLogo.png" class="header-logo" alt="logo" />
        <span class="header-title">管理后台</span>
      </div>
      <div class="header-right">
        <el-dropdown trigger="click">
          <span class="avatar-wrap">
            <el-avatar :src="imageUrl" :size="36" />
            <i class="el-icon-caret-bottom" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handle()">个人中心</el-dropdown-item>
            <el-dropdown-item divided @click.native="outLogin()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>

    <!-- 主体区：侧栏 + 内容 -->
    <div class="admin-body">
      <aside class="admin-sidebar">
        <el-menu :default-active="$route.path" :router="true" class="sidebar-menu">
          <el-menu-item index="/AdminIndex/AdminHome"><i class="el-icon-s-home" /><span>系统首页</span></el-menu-item>
          <el-menu-item index="/UserIndex/UserHome"><i class="el-icon-s-home" /><span>用户首页</span></el-menu-item>
          <el-menu-item index="/AdminIndex/AdminVerify"><i class="el-icon-document-checked" /><span>信息审核</span></el-menu-item>

          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu" /><span>信息管理</span></template>
            <el-menu-item index="/AdminIndex/AdminNotice">公告信息</el-menu-item>
            <el-menu-item index="/AdminIndex/AdminLost">失物信息</el-menu-item>
            <el-menu-item index="/AdminIndex/AdminFound">招领物品</el-menu-item>
            <el-menu-item index="/AdminIndex/AdminFeedBack">平台建议</el-menu-item>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title"><i class="el-icon-menu" /><span>用户管理</span></template>
            <el-menu-item index="/AdminIndex/AdminManage">管理员信息</el-menu-item>
            <el-menu-item index="/AdminIndex/UserManage">用户信息</el-menu-item>
          </el-submenu>
        </el-menu>
      </aside>
      <main class="admin-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
export default {
  data() { return { imageUrl: '' } },
  created() {
    const avatar = localStorage.getItem('avatar')
    if (avatar) this.imageUrl = `/main/download?name=${avatar}`
  },
  methods: {
    outLogin() { localStorage.setItem('jwt', ''); this.$router.push('/') },
    handle() { if (this.$route.path !== '/PersonalCenter') this.$router.push('/PersonalCenter') },
    handleSelect() {}, handleOpen() {}, handleClose() {},
  },
}
</script>

<style scoped>
/* ===== 整体布局 ===== */
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

/* ===== 顶部栏 ===== */
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 20px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  flex-shrink: 0;
}
.header-left { display: flex; align-items: center; gap: 12px; }
.header-logo { height: 36px; width: auto; }
.header-title { font-size: 14px; color: #909399; font-weight: 500; border-left: 1px solid #e8e8e8; padding-left: 12px; }
.header-right { flex-shrink: 0; }
.avatar-wrap { display: flex; align-items: center; gap: 4px; cursor: pointer; }

/* ===== 主体 ===== */
.admin-body { display: flex; flex: 1; overflow: hidden; }
.admin-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #ebeef5;
  overflow-y: auto;
}
.sidebar-menu { border-right: none !important; }
.admin-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  min-width: 0;
}
::-webkit-scrollbar { width: 0px; }

/* ===== 响应式 ===== */
@media (max-width: 992px) {
  .admin-sidebar { width: 200px; }
  .header-logo { height: 30px; }
  .header-title { font-size: 13px; }
}
@media (max-width: 768px) {
  .admin-sidebar { width: 160px; }
  .admin-header { padding: 0 12px; height: 48px; }
  .header-logo { height: 26px; }
  .header-title { display: none; }
  .admin-main { padding: 12px; }
  .el-menu-item { padding: 0 12px !important; font-size: 13px; }
  .el-submenu__title { padding: 0 12px !important; font-size: 13px; }
}
@media (max-width: 480px) {
  .admin-body { flex-direction: column; }
  .admin-sidebar { width: 100%; max-height: 200px; border-right: none; border-bottom: 1px solid #ebeef5; }
  .admin-header { padding: 0 10px; height: 44px; }
  .header-logo { height: 24px; }
}
</style>
