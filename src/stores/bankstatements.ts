import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { useAuthStore } from "./auth";
import type BankStatement from "@/models/accounting/bankstatement.model";

export const useBankstatementsStore = defineStore({
    id: "bankStatement",
    state: () => ({
      bankstatements: ref<BankStatement[]>([]),

      error: null,
    }),
    getters: {
      getBankstatements(state) {
        return state.bankstatements;
      }
    },
    actions: {
      async fetchBankStatements(accountId: Number) {
        this.bankstatements = []
        if(accountId === -1)
          return;
        
        const { getUserToken, getAuthToken } = useAuthStore();
        try {
          const data = await axios.get(`${import.meta.env.VITE_ECONOMY_API_BASE_URL}/api/transaction/bankstatements/${accountId}`, {
            headers: {
              Authorization: `Bearer ${getAuthToken}`,
              Token: `${getUserToken}`
            }
          })
          data.data.map((item: BankStatement) => {
            item.month = new Date(item.date).toLocaleDateString('nb-NO', { month: 'long'});
            this.bankstatements.push(item);
          })
        }
        catch (error) {
            alert(error);
            console.log(error);
        }
        finally {
        }
      },
      async refreshBankStatements(accountId: number) {
        let maxTransactionId = Math.max(...this.bankstatements.map(bs => bs.transactionId));
        const { getUserToken, getAuthToken } = useAuthStore();
        try {
          const data = await axios.get(`${import.meta.env.VITE_ECONOMY_API_BASE_URL}/api/transaction/bankstatements/${accountId}/after/${maxTransactionId}`, {
            headers: {
              Authorization: `Bearer ${getAuthToken}`,
              Token: `${getUserToken}`
            }
          })
          data.data.map((item: BankStatement) => {
            item.month = new Date(item.date).toLocaleDateString('nb-NO', { month: 'long'});
            this.bankstatements.push(item);
          })
        }
        catch (error) {
            alert(error);
            console.log(error);
        }
        finally {
        }
      }
    },
  });
  