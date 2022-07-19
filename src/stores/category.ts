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
        this.categories.push(category)
        //Api call
        console.log("Todo: stores>category.ts>addCategory")
      },
      async updateCategory(category: Category) {
        //Update
        console.log("Todo: stores>category.ts>updateCategory")
      }
    },
  });
  