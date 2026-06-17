import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          name: 'home-view',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'achievements',
          name: 'achievements-view',
          component: () => import('@/views/AchievementsView.vue')
        },
        {
          path: 'unlock/:mode/:difficulty/',
          name: 'unlock-view',
          component: () => import('@/views/games/UnlockView.vue')
        }
      ],
    },
    {
      path: '/introduction/:gameType',
      name: 'introduction-view',
      component: () => import('@/views/IntroductionView.vue'),
    },
    {
      path: '/game',
      component: () => import('@/layouts/GameLayout.vue'),
      children: [
        {
          path: 'forms/:difficulty/:phase/',
          name: 'forms-view',
          component: () => import('@/views/games/FormView.vue'),
          beforeEnter: (to, from) => {
            const difficulty = to.params.difficulty
            if (!['easy', 'medium', 'hard'].includes(difficulty)) {
              console.error(`Parâmetro de dificultade errado, você passou: ${difficulty}`)
              return '/'
            }
          },
        },
        {
          path: 'numbers/:difficulty/:phase/',
          name: 'numbers-view',
          component: () => import('@/views/games/NumberView.vue'),
          beforeEnter: (to, from) => {
            const difficulty = to.params.difficulty
            if (!['easy', 'medium', 'hard'].includes(difficulty)) {
              console.error(`Parâmetro de dificultade errado, você passou: ${difficulty}`)
              return '/'
            }
          },
        },
        {
          path: 'feedback/:hits/:required/:mode/:difficulty/:phase/',
          name: 'feedback-view',
          component: () => import('@/views/games/FeedBackView.vue'),
        },
      ],
    },
  ],
})

export default router
