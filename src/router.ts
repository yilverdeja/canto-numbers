import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import PlayPage from '@/pages/PlayPage.vue'
import StatsPage from '@/pages/StatsPage.vue'

const routes = [
  {
    path: '/',
    name: "home",
    component: HomePage,
    meta: {
      title: 'Canto Numbers'
    }
    // redirect: to => {
    //   return "play"
    // }
  },
  {
    path: '/play',
    name: "play",
    component: PlayPage,
    meta: {
      title: 'Play Canto Numbers',
    },
  },
  {
    path: '/stats',
    component: StatsPage,
    meta: {
      title: 'Stats Canto Numbers',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
