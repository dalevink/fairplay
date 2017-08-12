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
      path: '/edit-players',
      component: Team,
      props: { visibility: 'active' }
    },
    {
      path: '/edit-players/archived',
      name: 'Add Team',
      component: Team,
      props: { visibility: 'archived' }
    },
    {
      path: '/play-game',
      name: 'View Game',
      component: Game
    }
  ]
})
