import { defineStore } from "pinia";
import { useAuth0 } from '@auth0/auth0-vue';

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({
      authToken: '',
      userToken: '',
      error: null
    }),
    getters: {
      getAuthToken(state) {
        return state.authToken;
      },
      getUserToken(state) {
        return state.userToken;
      }
    },
    actions: {
      async setTokens(userToken: string, accessToken: string) {
        console.log(userToken + '  accessToken: ' + accessToken);
        this.authToken = accessToken;
        this.userToken = userToken;
      }
    },
  });
  