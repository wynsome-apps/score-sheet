import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/players',
      name: 'players',
      component: () => import('../views/PlayersView.vue')
    },
    {
      path: '/game-templates',
      name: 'game-templates',
      component: () => import('../views/GameTemplatesView.vue')
    },
    {
      path: '/play',
      name: 'play',
      component: () => import('../views/PlayView.vue')
    }
  ]
})

export default router
