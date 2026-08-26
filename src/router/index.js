import { createRouter, createWebHistory } from 'vue-router'

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard']
const VALID_PHASES = ['one', 'two', 'three']

function validateGameParams(to) {
  const { difficulty, phase } = to.params
  if (!VALID_DIFFICULTIES.includes(difficulty)) {
    console.error(`Parâmetro de dificuldade errado, você passou: ${difficulty}`)
    return '/'
  }
  if (!VALID_PHASES.includes(phase)) {
    console.error(`Parâmetro de fase errado, você passou: ${phase}`)
    return '/'
  }
}

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
          beforeEnter: validateGameParams,
        },
        {
          path: 'numbers/:difficulty/:phase/',
          name: 'numbers-view',
          component: () => import('@/views/games/NumberView.vue'),
          beforeEnter: validateGameParams,
        },
        {
          path: 'sounds/:difficulty/:phase',
          name: 'sounds-view',
          component: () => import('@/views/games/SoundView.vue'),
          beforeEnter: validateGameParams,
        },
        {
          path: 'feedback/',
          name: 'feedback-view',
          component: () => import('@/views/games/FeedBackView.vue'),
        },
        {
          path: 'unlock/:mode/:difficulty/',
          name: 'unlock-view',
          component: () => import('@/views/games/UnlockView.vue'),
        },
      ],
    },
  ],
})

export default router
