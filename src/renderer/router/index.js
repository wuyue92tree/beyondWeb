import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/pages/index').default,
      redirect: '/webContainer',
      children: [
        {
          path: '/webContainer',
          name: 'webContainer',
          component: require('@/pages/webContainer').default
        },
        {
          path: '/plugin',
          name: 'plugin',
          component: require('@/pages/plugin').default
        },
        {
          path: '/setting',
          name: 'setting',
          component: require('@/pages/setting').default
        }
      ]
    },
    {
      path: '*',
      name: 'webMainPage',
      component: require('@/pages/webMainPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
