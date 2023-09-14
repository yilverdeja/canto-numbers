import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import PlayPage from '@/pages/PlayPage.vue'
import PracticePage from '@/pages/PracticePage.vue'
import StatsPage from '@/pages/StatsPage.vue'
import TimePlayPage from '@/pages/TimePlayPage.vue'
import TimePracticePage from '@/pages/TimePracticePage.vue'

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
      title: 'Play Canto Integers',
    },
  },
  {
    path: '/time',
    name: "time",
    component: TimePlayPage,
    meta: {
      title: 'Play Canto Time',
    },
  },
  {
    path: '/practice',
    component: PracticePage,
    meta: {
      title: 'Practice Canto Numbers',
    },
  },
  {
    path: '/practicetime',
    component: TimePracticePage,
    meta: {
      title: 'Practice Canto Numbers',
    },
  },
  {
    path: '/stats',
    name: "stats",
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
