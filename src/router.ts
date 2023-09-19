import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import StatsPage from '@/pages/StatsPage.vue'
import PlayPage from '@/pages/PlayPage.vue'
import PracticePage from '@/pages/PracticePage.vue'
import CategoriesPage from '@/pages/CategoriesPage.vue'
import TypeHome from '@/pages/TypeHome.vue'
import NotFound from '@/pages/NotFound.vue'

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
    path: '/categories',
    name: "categories",
    component: CategoriesPage,
    meta: {
      title: 'Canto Numbers Categories'
    }
  },
  {
    path: '/integers',
    name: "integers",
    component: TypeHome,
    meta: {
      title: 'Canto Integers'
    }
  },
  {
    path: '/time',
    name: "time",
    component: TypeHome,
    meta: {
      title: 'Canto Time'
    }
  },
  {
    path: '/digits',
    name: "digits",
    component: TypeHome,
    meta: {
      title: 'Canto Digits'
    }
  },
  {
    path: '/integers/play',
    name: "playintegers",
    component: PlayPage,
    meta: {
      title: 'Play Canto Integers',
    },
  },
  {
    path: '/integers/practice',
    component: PracticePage,
    meta: {
      title: 'Practice Canto Numbers',
    },
  },
  {
    path: '/time/play',
    name: "playtime",
    component: PlayPage,
    meta: {
      title: 'Play Canto Time',
    },
  },
  {
    path: '/time/practice',
    component: PracticePage,
    meta: {
      title: 'Practice Canto Numbers',
    },
  },
  {
    path: '/digits/play',
    name: "playdigits",
    component: PlayPage,
    meta: {
      title: 'Play Canto Digits',
    },
  },
  {
    path: '/digits/practice',
    component: PracticePage,
    meta: {
      title: 'Practice Canto Digits',
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
  {
    path: '/:pathMatch(.*)*',
    name: "notfound",
    component: NotFound,
    meta: {
      title: 'Not Found',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
