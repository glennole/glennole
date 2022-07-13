import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";

export const useAccountingStore = defineStore({
    id: "accounting",
    state: () => ({
      accountings: [],
      accounting: null,
      loading: false,
      error: null,
    }),
    getters: {
      getAccountings(state) {
        return state.accountings
      },
      getAccounting(state) {
        return state.accounting
      }
    },
    actions: {
      async fetchAccountings() {
        this.accountings = []
        this.loading = true
        const { getUserToken, getAuthToken } =  useAuthStore();
        try {
            
            const data = await axios.get(`${import.meta.env.VITE_ECONOMY_API_BASE_URL}/api/accounting`, {
              headers: {
                Authorization: `Bearer ${getAuthToken}`,
                Token: `${getUserToken}`
              }
            })
            this.accountings = data.data
        } catch (error) {
            this.error = error
        } finally {
          this.loading = false
        }
      },
      async setAccounting(accountingId: Number) {
        if(accountingId === -1){
          this.accounting = {};
        }
        else {
          this.accounting = this.accountings.find((accounting) => accounting.id === accountingId);
        }
      }
    },
  });
  