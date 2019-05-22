import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/components/index').default,
      redirect: '/webContainer',
      children: [
        {
          path: '/webContainer',
          name: 'webContainer',
          component: require('@/components/webContainer').default
        },
        {
          path: '/plugin',
          name: 'plugin',
          component: require('@/components/plugin').default
        },
        {
          path: '/setting',
          name: 'setting',
          component: require('@/components/setting').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
