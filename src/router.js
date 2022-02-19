import { createRouter, createWebHistory } from 'vue-router';

import UserAuth from './pages/auth/UserAuth.vue';
import CoachesList from './pages/coaches/CoachesList.vue';
import CoachDetail from './pages/coaches/CoachDetail.vue';
import ContactCoach from './pages/requests/ContactCoach.vue';
import CoachRegistration from './pages/coaches/CoachRegistration.vue';
import RequestsReceived from './pages/requests/RequestsReceived.vue';
import NotFound from './pages/NotFound.vue';

import { store } from './store';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/coaches',
    },
    {
      path: '/coaches',
      component: CoachesList,
    },
    {
      path: '/coaches/:id',
      component: CoachDetail,
      props: true,
      children: [
        {
          path: 'contact',
          component: ContactCoach,
          props: true,
        },
      ],
    },
    {
      path: '/register',
      component: CoachRegistration,
      meta: {
        requiredAuth: true,
      },
    },
    {
      path: '/requests',
      component: RequestsReceived,
      meta: {
        requiredAuth: true,
      },
    },
    {
      path: '/auth',
      component: UserAuth,
      meta: {
        requiredUnAuth: true,
      },
    },
    {
      path: '/:notFound(.*)',
      component: NotFound,
    },
  ],
});

router.beforeEach(function (to, from, next) {
  if (Boolean(to.meta.requiredAuth) && !store.getters.isAuthenticated) {
    next('/auth');
  } else if (Boolean(to.meta.requiredUnAuth) && store.getters.isAuthenticated) {
    next('/coaches');
  } else {
    next();
  }
});
