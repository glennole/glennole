import { ref } from 'vue'
import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";
import type IAccounting from "@/models/accounting/accounting.model";
import type PurchaseGoods from '@/models/accounting/purchasegoods.model';
import { useBankstatementsStore } from './bankstatements';
import { useAccountStore } from './account';

export const useAccountingStore = defineStore({
    id: "accounting",
    state: () => ({
      accountings: [],
      accounting: ref<IAccounting>(),
      loading: false,
      error: null
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
      },
      async joinSharedAccounting(token: string) {
        const { getUserToken, getAuthToken } =  useAuthStore();
        this.loading = true;
        this.error = null;
        await axios.post<IAccounting>(`${import.meta.env.VITE_ECONOMY_API_BASE_URL}/api/accounting/join/`+ token, null, {
            headers: {
              Authorization: `Bearer ${getAuthToken}`,
              Token: `${getUserToken}`
            }
          })
          .then(response => {
            if(response.data)
            {
              this.accountings.push(response.data);
            }
            this.loading = false;
          })
          .catch((error) => {
            this.error = error;
            this.loading = false;
          })
          .finally( () =>{
            this.loading = false;
          });
      },
      async createAccounting(accounting: IAccounting) {
        this.loading = true
        const { getUserToken, getAuthToken } = useAuthStore();
        try {
          await axios.post<IAccounting>(`${import.meta.env.VITE_ECONOMY_API_BASE_URL}/api/accounting`, accounting, {
            headers: {
              Authorization: `Bearer ${getAuthToken}`,
              Token: `${getUserToken}`
            }
          })
          .then(response => {
            this.accountings.push(response.data)
          })
          .catch ((error) => {
            this.error = error;
            console.log('inner catch');
          })
        }
        catch (error) {
          this.error = error;
          console.log('outer catch')
        }
        finally {
          this.loading = false
        }
      },
      async registerPurchaseGoods(purchaseGoods: PurchaseGoods) {
        const { getUserToken, getAuthToken } = useAuthStore();
        const accountStore = useAccountStore();
        const bankstatementStore = useBankstatementsStore();
        try {
          await axios.post<PurchaseGoods>(`${import.meta.env.VITE_ECONOMY_API_BASE_URL}/api/accounting/purchasegoods`, purchaseGoods, {
            headers: {
              Authorization: `Bearer ${getAuthToken}`,
              Token: `${getUserToken}`
            }
          })
          .then(response => 
            bankstatementStore.refreshBankStatements(accountStore.account.id)
          )
          .catch ((error) => {
            alert(error);
            console.log(error)
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
  