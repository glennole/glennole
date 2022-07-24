import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import axios from "axios"

export const useAccountStore = defineStore({
    id: "account",
    state: () => ({
      accounts: [],
      account: null,
      loading: false,
      error: null
    }),
    getters: {
      getAccounts(state) {
        return state.accounts
      },
      getAccount(state) {
        return state.account
      }
    },
    actions: {
      async fetchAccounts(accountingId: Number) {
        this.accounts = [];
        this.account = null;
        if(accountingId === -1)
          return;
          
        this.loading = true;
        const { getUserToken, getAuthToken } = useAuthStore();
        try {
          const data = await axios.get(`${import.meta.env.VITE_ECONOMY_API_BASE_URL}/api/account/${accountingId}/allowed`, {
            headers: {
              Authorization: `Bearer ${getAuthToken}`,
              Token: `${getUserToken}`
            }
          })
          this.accounts = data.data
        }
        catch (error) {
            alert(error);
            console.log(error);
        }
        finally {
          this.loading = false;
        }
      },
      async setAccount(accountId: Number) {
        this.account = this.accounts.find((account) => account.id === accountId);
      }
    },
  });
  