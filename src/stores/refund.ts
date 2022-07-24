import { defineStore } from "pinia";
import { ref } from 'vue';
import axios from "axios";
import { useAuthStore } from "./auth";
import { useCategoryStore } from "./category";
import type IRefund from "@/models/accounting/refund.model";

export const useRefundStore = defineStore({
    id: "refund",
    state: () => ({
      accountingRefunds: ref<IRefund[]>([]),
      userRefunds: ref<IRefund[]>([]),
      loading: false,
      error: null
    }),
    getters: {
      getUserRefunds(state) {
        return state.userRefunds;
      },
      getAccountingRefunds(state) {
        return state.accountingRefunds;
      }
    },
    actions: {
      async fetchAccountingRefunds(accountingId: Number) {
        this.accountingRefunds = []
        this.loading = true
        const { getUserToken, getAuthToken } =  useAuthStore();
        try {
            
            const data = await axios.get(`${import.meta.env.VITE_ECONOMY_API_BASE_URL}/api/accounting/refunds/${accountingId}`, {
              headers: {
                Authorization: `Bearer ${getAuthToken}`,
                Token: `${getUserToken}`
              }
            })

            data.data.map((item: IRefund) => {
                this.accountingRefunds.push(item);
            })

        } catch (error) {
            this.error = error
        } finally {
          this.loading = false
        }
      },
      async fetchUserRefunds() {
        this.userRefunds = []
        this.loading = true
        const { getUserToken, getAuthToken } =  useAuthStore();
        try {
            
            const data = await axios.get(`${import.meta.env.VITE_ECONOMY_API_BASE_URL}/api/user/refunds`, {
              headers: {
                Authorization: `Bearer ${getAuthToken}`,
                Token: `${getUserToken}`
              }
            })

            data.data.map((item: IRefund) => {
                this.userRefunds.push(item);
            })

        } catch (error) {
            this.error = error
        } finally {
          this.loading = false
        }
      },
      async createRefund(accountingId: number, date: Date) {
        this.loading = true;
        const { getUserToken, getAuthToken } =  useAuthStore();
        try {
            
            const data = await axios.post(`${import.meta.env.VITE_ECONOMY_API_BASE_URL}/api/accounting/refunds/${accountingId}/${date.toISOString().split('T')[0]}`, null ,{
              headers: {
                Authorization: `Bearer ${getAuthToken}`,
                Token: `${getUserToken}`
              }
            })

            this.fetchAccountingRefunds(accountingId);

        } catch (error) {
            console.log(error)
            this.error = error
        } finally {
          this.loading = false
        }
      },
      async payRefund(refund: IRefund, categoryId: number) {
        this.loading = true;
        const { getUserToken, getAuthToken } =  useAuthStore();
        let date = new Date().toISOString().split('T')[0];
        try {
            
            const data = await axios.put(`${import.meta.env.VITE_ECONOMY_API_BASE_URL}/api/user/refunds/${categoryId}/${date}`, refund ,{
              headers: {
                Authorization: `Bearer ${getAuthToken}`,
                Token: `${getUserToken}`
              }
            })

            if (data.data.id === refund.id)
            {
              this.userRefunds.find((item) => item.id === refund.id).state = data.data.state;
            }

        } catch (error) {
            console.log(error)
            this.error = error
        } finally {
          this.loading = false
        }
      }
    },
  });
  