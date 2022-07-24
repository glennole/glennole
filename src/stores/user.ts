import { ref } from 'vue';
import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";
import type IUser from "@/models/accounting/user.model";
import type IRefund from '@/models/accounting/refund.model';

export const useUserStore = defineStore({
    id: "user",
    state: () => ({
      user: ref<IUser>(),
      selectedAccountingUsers: ref<IUser[]>([]),
      loading: false,
      error: null,
      refunds: ref<IRefund>()
    }),
    getters: {
      getUser(state) {
        return state.user;
      },
      getSelectedAccountingUsers(state) {
        return state.selectedAccountingUsers;
      },
      getRefunds(state) {
        return state.refunds;
      }
    },
    actions: {
      async fetchCurrentUser() {
        this.user = {}
        this.loading = true
        const { getUserToken, getAuthToken } =  useAuthStore();
        try {
            
            const data = await axios.get(`${import.meta.env.VITE_ECONOMY_API_BASE_URL}/api/user/${getUserToken}`, {
              headers: {
                Authorization: `Bearer ${getAuthToken}`,
                Token: `${getUserToken}`
              }
            })
            this.user = data.data
        } catch (error) {
            this.error = error
        } finally {
          this.loading = false
        }
      },
      async fetchSelectedAccountingUsers(accountingId: number) {
        this.selectedAccountingUsers = []
        this.loading = true
        const { getUserToken, getAuthToken } =  useAuthStore();
        try {
            
            const data = await axios.get(`${import.meta.env.VITE_ECONOMY_API_BASE_URL}/api/accounting/users/${accountingId}`, {
              headers: {
                Authorization: `Bearer ${getAuthToken}`,
                Token: `${getUserToken}`
              }
            })
            data.data.map((user: IUser) => {
                this.selectedAccountingUsers.push(user);
              })
        } catch (error) {
            this.error = error
        } finally {
          this.loading = false
        }
      }
    },
  });
  