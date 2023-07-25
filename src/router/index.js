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
      path: '/403',
      name: '403',
      component: () => import('../views/ForbiddenView.vue'),
    },
    {
      path: '/:name',
      name: 'other',
      component: () => import('../views/OtherView.vue'),
    },
  ],
});

router.beforeEach(async (to, from) => {
  const appStore = useAppStore();
  if (!appStore.token) await appStore.auth();

  console.log(to);

  if (to.name == 'other') {
    let name = to.params.name.split('-').join('.');
    let isAllow = appStore.access.includes(name);
    console.log(name, appStore.access, isAllow);
    if (!isAllow) return router.push('/403');
  }
});

export default router;
