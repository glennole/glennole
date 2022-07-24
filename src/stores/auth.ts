import { defineStore } from "pinia";

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
        this.authToken = accessToken;
        this.userToken = userToken;
      }
    },
  });
  