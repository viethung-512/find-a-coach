export default {
  namespaced: true,
  state() {
    return {
      requests: [],
    };
  },
  mutations: {
    addRequest(state, payload) {
      state.requests.push(payload);
    },
    setRequests(state, payload) {
      state.requests = payload;
    },
  },
  actions: {
    async addRequest(context, payload) {
      const newRequest = {
        userEmail: payload.email,
        message: payload.message,
      };

      const response = await fetch(
        `https://vue-http-demo-8d082-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`,
        {
          method: 'POST',
          body: JSON.stringify(newRequest),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(response.message || 'Failed to add request!');
      }

      context.commit('addRequest', {
        ...newRequest,
        id: responseData.name,
        coachId: payload.coachId,
      });
    },

    async loadRequests(context) {
      const coachId = context.rootGetters.userId;
      const response = await fetch(
        `https://vue-http-demo-8d082-default-rtdb.firebaseio.com/requests/${coachId}.json`
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to fetch!');
      }

      const requests = [];
      for (const key in responseData) {
        if (Object.hasOwnProperty.call(responseData, key)) {
          const element = responseData[key];

          requests.push({
            id: key,
            coachId,
            userEmail: element.userEmail,
            message: element.message,
          });
        }
      }

      context.commit('setRequests', requests);
      return;
    },
  },
  getters: {
    requests(state, _, __, rootGetters) {
      const coachId = rootGetters.userId;

      return state.requests.filter(
        (rq) => rq.coachId.toString() === coachId.toString()
      );
    },
    hasRequests(_, getters) {
      return getters.requests && getters.requests.length > 0;
    },
  },
};
