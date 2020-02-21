import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/home/home'
import StatisticList from '@/components/statisticList/statisticList'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: {
        name: 'statisticList'
      }
    },
    {
      path: '/home',
      redirect: {name: 'statisticList'},
      component: Home,
      children: [
        {
          path: 'statisticList',
          component: StatisticList,
          name: 'statisticList'
        }
      ]
    }
  ]
})
