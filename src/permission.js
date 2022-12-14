import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getRefreshToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
/* Layout */
import Layout from '@/layout'
import Cookies from 'js-cookie'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
let isAddRouter = false
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  const hasRefreshToken = getRefreshToken()

  if (hasToken && hasRefreshToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.userName
      if (hasGetUserInfo) {
        if (Cookies.get('isAdmin') !== 'false') {
          if (!isAddRouter) {
            isAddRouter = true
            router.addRoutes([
              {
                path: '/userManagement',
                component: Layout,
                redirect: '/userManagement/index',
                alwaysShow: false,
                name: '用户管理',
                meta: {
                  title: '用户管理',
                  icon: 'el-icon-user'
                },
                hidden: false,
                children: [{
                  path: 'userManagement',
                  name: 'UserManagement',
                  component: () => import('@/views/userManagement/index'),
                  meta: { title: '用户管理', icon: 'el-icon-user' }
                }]
              },
              {
                path: '/userStatistics',
                component: Layout,
                redirect: '/userStatistics/index',
                alwaysShow: false,
                name: '用户统计',
                meta: {
                  title: '用户统计',
                  icon: 'el-icon-s-data'
                },
                hidden: false,
                children: [{
                  path: 'userStatistics',
                  name: 'UserStatistics',
                  component: () => import('@/views/userStatistics/index'),
                  meta: { title: '用户统计', icon: 'el-icon-s-data' }
                }]
              }
            ])

            router.options.routes.push({
              path: '/userManagement',
              component: Layout,
              redirect: '/userManagement/index',
              alwaysShow: false,
              name: '用户管理',
              meta: {
                title: '用户管理',
                icon: 'el-icon-user'
              },
              hidden: false,
              children: [{
                path: 'userManagement',
                name: 'UserManagement',
                component: () => import('@/views/userManagement/index'),
                meta: { title: '用户管理', icon: 'el-icon-user' }
              }]
            },
            {
              path: '/userStatistics',
              component: Layout,
              redirect: '/userStatistics/index',
              alwaysShow: false,
              name: '用户统计',
              meta: {
                title: '用户统计',
                icon: 'el-icon-s-data'
              },
              hidden: false,
              children: [{
                path: 'userStatistics',
                name: 'UserStatistics',
                component: () => import('@/views/userStatistics/index'),
                meta: { title: '用户统计', icon: 'el-icon-s-data' }
              }]
            }
            )
          }
        } else {
          console.log('不是admin')
        }
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          console.log('error', error)
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
