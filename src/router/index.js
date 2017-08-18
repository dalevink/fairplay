import Vue from 'vue'
import Router from 'vue-router'
import Team from '@/components/Team'
import Game from '@/components/Game'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Game,
      name: 'FairPlay'
    },
    {
      path: '/edit-players',
      component: Team,
      props: { visibility: 'active' }
    }
  ]
})
