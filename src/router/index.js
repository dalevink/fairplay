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
      name: 'Add Team',
      component: Team
    },
    {
      path: '/view-game',
      name: 'View Game',
      component: Game
    }
  ]
})
