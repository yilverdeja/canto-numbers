import { createRouter, createWebHistory } from 'vue-router'
import PlayPage from '@/pages/PlayPage.vue'
import Play2Page from '@/pages/Play2Page.vue'
import StatsPage from '@/pages/StatsPage.vue'

const routes = [
  {
    path: '/',
    redirect: to => {
      return "play"
    }
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
    path: '/play2',
    name: "play2",
    component: Play2Page,
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
