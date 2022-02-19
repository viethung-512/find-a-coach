import { createRouter, createWebHistory } from 'vue-router';

import CoachesList from './pages/coaches/CoachesList.vue';
import NotFound from './pages/NotFound.vue';

import { store } from './store';

const CoachDetail = () => import('./pages/coaches/CoachDetail.vue');
const CoachRegistration = () => import('./pages/coaches/CoachRegistration.vue');
const ContactCoach = () => import('./pages/requests/ContactCoach.vue');
const RequestsReceived = () => import('./pages/requests/RequestsReceived.vue');
const UserAuth = () => import('./pages/auth/UserAuth.vue');

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
