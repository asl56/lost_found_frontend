<template>
  <div class="user-layout">
    <!-- 顶部导航栏 - flex 布局，不再使用 absolute/float -->
    <header class="user-header">
      <div class="header-left">
        <router-link to="/UserIndex/UserHome" class="logo-link">
          <img src="../../assets/img/LostLogo.png" class="header-logo" alt="失物招领平台" />
        </router-link>
      </div>

      <nav class="header-nav">
        <router-link to="/UserIndex/UserHome" class="nav-item" :class="{ active: $route.path === '/UserIndex/UserHome' }">首页</router-link>
        <router-link to="/UserIndex/UserLostHome" class="nav-item" :class="{ active: $route.path.startsWith('/UserIndex/UserLostHome') }">失物中心</router-link>
        <router-link to="/UserIndex/UserFoundHome" class="nav-item" :class="{ active: $route.path.startsWith('/UserIndex/UserFoundHome') }">招领中心</router-link>
        <router-link to="/UserIndex/UserFeedBack" class="nav-item" :class="{ active: $route.path === '/UserIndex/UserFeedBack' }">反馈</router-link>

        <el-dropdown trigger="hover" class="nav-dropdown">
          <span class="nav-item nav-dropdown-trigger">我的 <i class="el-icon-arrow-down" /></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><router-link to="/UserIndex/MyLost" class="dropdown-link">我发布的失物</router-link></el-dropdown-item>
            <el-dropdown-item><router-link to="/UserIndex/MyFound" class="dropdown-link">我发布的招领</router-link></el-dropdown-item>
            <el-dropdown-item><router-link to="/UserIndex/MyContact" class="dropdown-link">我的联系</router-link></el-dropdown-item>
            <el-dropdown-item><router-link to="/UserIndex/ContactMe" class="dropdown-link">联系我的</router-link></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <router-link v-if="role === '管理员'" to="/AdminIndex/AdminHome" class="nav-item admin-link">管理员</router-link>
      </nav>

      <div class="header-right">
        <el-dropdown trigger="click">
          <span class="avatar-wrap">
            <el-avatar :src="imageUrl" :size="38" />
            <i class="el-icon-caret-bottom" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handle()">个人中心</el-dropdown-item>
            <el-dropdown-item divided @click.native="outLogin()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>

    <!-- 页面内容区 -->
    <main class="user-main">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      role: '',
      imageUrl: '',
    }
  },
  created() {
    const avatar = localStorage.getItem('avatar')
    if (avatar) this.imageUrl = `/main/download?name=${avatar}`
    this.role = localStorage.getItem('role')
  },
  methods: {
    handle() {
      if (this.$route.path !== '/UserIndex/UserPersonalCenter')
        this.$router.push('/UserIndex/UserPersonalCenter')
    },
    outLogin() {
      localStorage.setItem('jwt', '')
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
/* ===== 整体布局 ===== */
.user-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ===== 顶部导航栏 ===== */
.user-header {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  position: sticky;
  top: 0;
  z-index: 100;
  gap: 12px;
  flex-shrink: 0;
}
.header-left {
  flex-shrink: 0;
  margin-right: 16px;
}
.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}
.header-logo {
  height: 44px;
  width: auto;
  object-fit: contain;
}

/* ===== 导航菜单 ===== */
.header-nav {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
}
.nav-item {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #606266;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s;
  cursor: pointer;
}
.nav-item:hover { color: #409EFF; background: rgba(64,158,255,0.06); }
.nav-item.active { color: #409EFF; background: rgba(64,158,255,0.1); font-weight: 600; }
.nav-item.admin-link { color: #E6A23C; }
.nav-item.admin-link:hover { background: rgba(230,162,60,0.08); }
.nav-dropdown-trigger { gap: 4px; }
.dropdown-link { color: #606266; text-decoration: none; display: block; width: 100%; }

/* ===== 右侧头像 ===== */
.header-right { flex-shrink: 0; margin-left: auto; }
.avatar-wrap { display: flex; align-items: center; gap: 4px; cursor: pointer; }

/* ===== 内容区 ===== */
.user-main {
  flex: 1;
  padding: 20px 0 0;
}

/* ===== 响应式 ===== */
@media (max-width: 992px) {
  .user-header { padding: 0 16px; gap: 8px; }
  .header-logo { height: 36px; }
  .header-left { margin-right: 8px; }
  .nav-item { padding: 6px 12px; font-size: 13px; }
}
@media (max-width: 768px) {
  .user-header { height: 52px; padding: 0 10px; }
  .header-logo { height: 30px; }
  .header-nav { gap: 0; }
  .nav-item { padding: 6px 10px; font-size: 13px; }
  .user-main { padding: 12px 0 0; }
}
@media (max-width: 480px) {
  .user-header { height: 48px; padding: 0 6px; gap: 4px; }
  .header-logo { height: 26px; }
  .header-left { margin-right: 4px; }
  .nav-item { padding: 5px 7px; font-size: 12px; border-radius: 6px; }
  .header-right .el-avatar { width: 30px !important; height: 30px !important; line-height: 30px !important; }
}
</style>
