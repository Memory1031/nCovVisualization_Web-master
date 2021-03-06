import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/home/home'
import StatisticList from '@/components/statisticList/statisticList'
import ChinaMap from '@/components/chinaMap/chinaMap'
import RiskAssess from '@/components/riskAssess/riskAssess'
import Route from '@/components/route/route'
import RouteTable from '@/components/routetable/routetable'
import RouteChoose from '@/components/routechoose/routechoose'
import RouteMap from '@/components/routechoose/routeMap'
import DataSum from '@/components/data/dataSum'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/',
      redirect: {
        name: 'dataSum'
      }
    },
    {
      path: '/routeMap',

      name: 'routeMap',

      component: RouteMap
    },
    {
      path: '/home',
      redirect: {
        name: 'dataSum'
      },
      component: Home,
      children: [{
          path: 'dataSum',
          component: DataSum,
          name: 'dataSum'
        },
        {
          path: 'statisticList',
          component: StatisticList,
          name: 'statisticList'
        },
        {
          path: 'chinaMap',
          component: ChinaMap,
          name: 'chinaMap'
        },
        {
          path: 'riskAssess',
          component: RiskAssess,
          name: 'riskAssess'
        },
        {
          path: 'route',
          component: Route,
          name: 'route'
        },
        {
          path: 'routetable',
          component: RouteTable,
          name: 'routetable'
        },
        {
          path: 'routechoose',
          component: RouteChoose,
          name: 'routechoose'
        }
      ]
    }
  ]
})
