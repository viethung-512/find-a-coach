const AUTH_KEY = 'AIzaSyAdUs9dlH_0PDE-zy7CHh7-pIyYhsQmdkY';
const firebaseLoginEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${AUTH_KEY}`;
const firebaseSignupEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${AUTH_KEY}`;

let timer;

export default {
  state() {
    return {
      userId: null,
      token: null,
      didAutoLogout: false,
    };
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
      state.didAutoLogout = false;
    },
    setAutoLogout(state) {
      state.didAutoLogout = true;
    },
  },
  actions: {
    async login(context, payload) {
      return context.dispatch('auth', {
        ...payload,
        mode: 'login',
      });
    },
    async signup(context, payload) {
      return context.dispatch('auth', {
        ...payload,
        mode: 'signup',
      });
    },
    async auth(context, payload) {
      let url = firebaseLoginEndpoint;
      if (payload.mode === 'signup') {
        url = firebaseSignupEndpoint;
      }
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to authenticate.');
      }

      const expiresIn = responseData.expiresIn * 1000;
      // const expiresIn = 5000;
      const expirationDate = new Date().getTime() + expiresIn;

      localStorage.setItem('token', responseData.idToken);
      localStorage.setItem('userId', responseData.localId);
      localStorage.setItem('tokenExpiration', expirationDate);

      timer = setTimeout(() => {
        context.dispatch('autoLogout');
      }, expiresIn);

      context.commit('setUser', {
        token: responseData.idToken,
        userId: responseData.localId,
      });
    },
    tryLogin(context) {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const tokenExpiration = localStorage.getItem('tokenExpiration');

      const expiresIn = +tokenExpiration - new Date().getTime();
      if (expiresIn < 0) {
        return;
      }

      timer = setTimeout(() => {
        context.dispatch('autoLogout');
      }, expiresIn);

      if (userId && token) {
        context.commit('setUser', {
          token,
          userId,
        });
      }
    },
    logout(context) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('tokenExpiration');

      clearTimeout(timer);

      context.commit('setUser', {
        userId: null,
        token: null,
      });
    },
    autoLogout(context) {
      context.dispatch('logout');
      context.commit('setAutoLogout');
    },
  },
  getters: {
    userId(state) {
      return state.userId;
    },
    token(state) {
      return state.token;
    },
    isAuthenticated(state) {
      return Boolean(state.token);
    },
    didAutoLogout(state) {
      return state.didAutoLogout;
    },
  },
};
