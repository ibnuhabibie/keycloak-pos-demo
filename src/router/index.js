import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

import { useAppStore } from '@/store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/*',
      name: 'other',
      meta: {
        checkAccess: true,
      },
      component: () => import('../views/OtherView.vue'),
    },
  ],
});

router.beforeEach(async (to, from) => {
  const appStore = useAppStore();
  await appStore.auth();
});

export default router;
