import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";

export const useTransactionStore = defineStore({
    id: "transaction",
    state: () => ({
      transactions: [],
      loading: false,
      error: null,
    }),
    getters: {
      getTransactions(state) {
        return state.transactions;
      }
    },
    actions: {
      async fetchTransactions(accountId: Number) {
        this.transactions = []
        this.loading = true
        const { getUserToken, getAuthToken } =  useAuthStore();
        try {
            
            const data = await axios.get(`${import.meta.env.VITE_ECONOMY_API_BASE_URL}/api/transaction/${accountId}`, {
              headers: {
                Authorization: `Bearer ${getAuthToken}`,
                Token: `${getUserToken}`
              }
            })
            this.transactions = data.data
        } catch (error) {
            this.error = error
        } finally {
          this.loading = false
        }
      }
    },
  });
  