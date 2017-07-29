import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Team from '@/components/Team'
import Game from '@/components/Game'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/add-team',
      component: Team,
      props: { visibility: 'active' }
    },
    {
      path: '/add-team/archived',
      name: 'Add Team',
      component: Team,
      props: { visibility: 'archived' }
    },
    {
      path: '/view-game',
      name: 'View Game',
      component: Game
    }
  ]
})
