import { createRouter as createVueRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AccountingView from "@/views/AccountingView.vue";
import { createAuthGuard } from "@auth0/auth0-vue";
import CategoryView from "@/views/CategoryView.vue";

export function createRouter(app: App) {
  return createVueRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: "/accounting",
        name: "Accounting",
        component: AccountingView,
      },
      {
        path: "/categories",
        name: "Categories",
        component: CategoryView,
      },
      {
        path: "/refund",
        name: "refund",
        component: () => import('../views/RefundView.vue'),
        beforeEnter: createAuthGuard(app),
      },
      {
        path: "/equipment",
        name: "Equipment",
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("../views/EquipmentView.vue"),
      },
      {
        path: "/",
        name: "Home",
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("../views/HomeView.vue"),
      },
    ],
  })
}