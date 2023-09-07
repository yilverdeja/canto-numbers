import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import PlayPage from '@/pages/PlayPage.vue'
import PracticePage from '@/pages/PracticePage.vue'

const routes = [
  {
    path: '/',
    name: "home",
    component: HomePage,
    meta: {
      title: 'Canto Numbers'
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
    path: '/practice',
    component: PracticePage,
    meta: {
      title: 'Practice Canto Numbers',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
