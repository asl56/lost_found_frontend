import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import AdminIndex from '../views/AdminIndex.vue'
import AdminHome from '../views/AdminHome.vue'
import AdminNotice from '@/views/AdminNotice.vue'
import PersonalCenter from '@/views/PersonalCenter.vue'
import AdminLost from '@/views/AdminLost.vue'
import AdminFound from '@/views/AdminFound.vue'
import AdminFeedBack from '@/views/AdminFeedBack.vue'
import AdminManage from '@/views/AdminManage.vue'
import UserManage from '@/views/UserManage.vue'
import UserIndex from '@/views/user/UserIndex.vue'
import UserHome from '@/views/user/UserHome.vue'
import UserLostHome from '@/views/user/UserLostHome.vue'
import UserFoundHome from '@/views/user/UserFoundHome.vue'
import UserFeedBack from '@/views/user/UserFeedBack.vue'
import UserPersonalCenter from '@/views/user/UserPersonalCenter.vue'
import MyLost from '@/views/user/MyLost.vue'
import MyFound from '@/views/user/MyFound.vue'
import MyContact from '@/views/user/MyContact.vue'
import ContactMe from '@/views/user/ContactMe.vue'
import AdminVerify from '@/views/AdminVerify.vue'
import NotFound from '@/views/errors/NotFound.vue'
import Forbidden from '@/views/errors/Forbidden.vue'
import ServerError from '@/views/errors/ServerError.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/PersonalCenter',
    name: 'PersonalCenter',
    component: PersonalCenter,
    meta: { requiresAuth: true } // 修复：添加路由元信息标记需要登录，未登录访问将被路由守卫拦截
  },
  {
    path: '/UserIndex',
    name: 'UserIndex',
    component: UserIndex,
    meta: { requiresAuth: true }, // 防御性路由守卫：UserIndex及其所有子路由均需登录
    children:[
      { path: 'UserHome', name: 'home', component: UserHome },
      { path: 'UserLostHome', name: 'Losthome', component: UserLostHome },
      { path: 'UserFoundHome', name: 'FoundHome', component: UserFoundHome },
      { path: 'UserFeedBack', name: 'feedback', component: UserFeedBack },
      { path: 'UserPersonalCenter', name: 'UserPersonalCenter', component: UserPersonalCenter },
      { path: 'MyLost', name: 'MyLost', component: MyLost },
      { path: 'MyFound', name: 'MyFound', component: MyFound },
      { path: 'MyContact', name: 'MyContact', component: MyContact },
      { path: 'ContactMe', name: 'ContactMe', component: ContactMe },
    ]
  },
  {
    path: '/AdminIndex',
    name: 'index',
    component: AdminIndex,
    meta: { requiresAuth: true }, // 防御性路由守卫：AdminIndex及其所有子路由均需登录
    children: [
      { path: 'AdminHome', name: 'home', component: AdminHome },
      { path: 'AdminNotice', name: 'notice', component: AdminNotice },
      { path: 'AdminLost', name: 'lost', component: AdminLost },
      { path: 'AdminFound', name: 'found', component: AdminFound },
      { path: 'AdminFeedBack', name: 'feedback', component: AdminFeedBack },
      { path: 'AdminManage', name: 'manage', component: AdminManage },
      { path: 'UserManage', name: 'userManage', component: UserManage },
      { path: 'AdminVerify', name: 'AdminVerify', component: AdminVerify },
    ]
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: Forbidden
  },
  {
    path: '/500',
    name: 'ServerError',
    component: ServerError
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const adminRoutePrefix = '/AdminIndex'

router.beforeEach((to, from, next) => {
  // 登录页面无需认证
  if (to.path === '/') {
    next()
    return
  }

  const token = localStorage.getItem('jwt')
  const role = localStorage.getItem('role')

  // 未登录拦截：需要认证的页面（包括 PersonalCenter）必须登录后访问
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next('/')
    return
  }

  // 全局未登录兜底拦截
  if (!token) {
    next('/')
    return
  }

  // 管理员路由权限校验：仅"管理员"角色可访问 /AdminIndex 开头的路由
  if (to.path.startsWith(adminRoutePrefix) && role !== '管理员') {
    next('/403')
    return
  }

  next()
})

export default router
