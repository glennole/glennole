import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { useAuthStore } from "./auth";
import type Category from "@/models/accounting/category.model";

export const useCategoryStore = defineStore({
    id: "category",
    state: () => ({
      categories: ref<Category[]>([]),
      error: null,
    }),
    getters: {
      getCategories(state) {
        return state.categories;
      }
    },
    actions: {
      async fetchCategories() {
        this.categories = [];
        
        const { getUserToken, getAuthToken } = useAuthStore();
        try {
          const data = await axios.get(`${import.meta.env.VITE_ECONOMY_API_BASE_URL}/api/category`, {
            headers: {
              Authorization: `Bearer ${getAuthToken}`,
              Token: `${getUserToken}`
            }
          })
          data.data.map((category: Category) => {
            this.categories.push(category);
          })
        }
        catch (error) {
            alert(error);
            console.log(error);
        }
        finally {
        }
      },
      async addCategory(category: Category) {
        const { getUserToken, getAuthToken } = useAuthStore();
        try {
          await axios.post<Category>(`${import.meta.env.VITE_ECONOMY_API_BASE_URL}/api/category`, category, {
            headers: {
              Authorization: `Bearer ${getAuthToken}`,
              Token: `${getUserToken}`
            }
          })
          .then(response => 
            this.categories.push(response.data)
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
      },
      async updateCategory(category: Category) {
        const { getUserToken, getAuthToken } = useAuthStore();
        try {
          await axios.put<Category>(`${import.meta.env.VITE_ECONOMY_API_BASE_URL}/api/category/${category.id}`, category, {
            headers: {
              Authorization: `Bearer ${getAuthToken}`,
              Token: `${getUserToken}`
            }
          })
          .then(response => { 
            let index = this.categories.findIndex(cat => cat.id === response.data.id);
            this.categories[index].name = response.data.name;
          }
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
      },
      async deleteCategory(category: Category) {
        const { getUserToken, getAuthToken } = useAuthStore();
        try {
          await axios.delete(`${import.meta.env.VITE_ECONOMY_API_BASE_URL}/api/category/${category.id}`, {
            headers: {
              Authorization: `Bearer ${getAuthToken}`,
              Token: `${getUserToken}`
            }
          })
          .then(response => { 
            if(response.data === true) {
              let index = this.categories.findIndex(cat => cat.id === category.id);
              this.categories.splice(index, 1);
            }
          }
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
  