import { createStore } from 'vuex';

import authModule from './modules/auth';
import coachesModule from './modules/coaches';
import requestsModule from './modules/requests';

export const store = createStore({
  modules: {
    auth: authModule,
    coaches: coachesModule,
    requests: requestsModule,
  },
});
