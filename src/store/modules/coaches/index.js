export default {
  namespaced: true,
  state() {
    return {
      lastFetch: null,
      coaches: [
        {
          id: 'c1',
          firstName: 'Maximilian',
          lastName: 'Schwarzmüller',
          areas: ['frontend', 'backend', 'career'],
          description:
            "I'm Maximilian and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
          hourlyRate: 30,
        },
        {
          id: 'c2',
          firstName: 'Julie',
          lastName: 'Jones',
          areas: ['frontend', 'career'],
          description:
            'I am Julie and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.',
          hourlyRate: 30,
        },
      ],
    };
  },
  mutations: {
    registerCoach(state, payload) {
      state.coaches.push(payload);
    },
    setCoaches(state, payload) {
      state.coaches = payload;
    },
    setFetchTimestamp(state) {
      state.lastFetch = new Date().getTime();
    },
  },
  actions: {
    async registerCoach(context, payload) {
      const userId = context.rootGetters.userId;
      const coachData = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        description: payload.description,
        hourlyRate: payload.rate,
        areas: payload.areas,
      };
      const token = context.rootGetters.token;

      const response = await fetch(
        `https://vue-http-demo-8d082-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=${token}`,
        {
          method: 'PUT',
          body: JSON.stringify(coachData),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.ok) {
        context.commit('registerCoach', { ...coachData, id: userId });
        return;
      }

      // throw new Error()
    },
    async loadCoaches(context, payload) {
      if (!payload.forceRefresh && !context.getters.shouldUpdate) {
        return;
      }

      const response = await fetch(
        `https://vue-http-demo-8d082-default-rtdb.firebaseio.com/coaches.json`
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to fetch!');
      }

      const coaches = [];
      for (const key in responseData) {
        if (Object.hasOwnProperty.call(responseData, key)) {
          const element = responseData[key];

          coaches.push({
            id: key,
            firstName: element.firstName,
            lastName: element.lastName,
            description: element.description,
            hourlyRate: element.hourlyRate,
            areas: element.areas,
          });
        }
      }

      context.commit('setCoaches', coaches);
      context.commit('setFetchTimestamp');
    },
  },
  getters: {
    coaches(state) {
      return state.coaches;
    },
    hasCoaches(state) {
      return state.coaches && state.coaches.length > 0;
    },
    isCoach(state, getters, rootState, rootGetters) {
      const coaches = getters.coaches;
      const userId = rootGetters.userId;

      return coaches.some((c) => c.id === userId);
    },
    shouldUpdate(state) {
      const lastFetch = state.lastFetch;
      if (!lastFetch) {
        return true;
      }

      const currentTimestamp = new Date().getTime();

      return (currentTimestamp - lastFetch) / 1000 > 60;
    },
  },
};
