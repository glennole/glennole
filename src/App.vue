<script setup lang="ts">
  import { RouterLink, RouterView } from "vue-router";
  import Menu from "@/components/Menu.vue"
  import Login from "./components/Login.vue"
  import Logout from "./components/Logout.vue"
  import { useAuth0 } from '@auth0/auth0-vue';
  import { useAuthStore } from "./stores/auth";
  import { ref, onMounted, watch } from 'vue';

  const {isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0();
  const authStore = useAuthStore();
  
  watch(isLoading, async (value, oldValue) => {
      if (value === false && isAuthenticated.value === true) {
        let userToken = user.value['https://glennole.com/token'];
        let accessToken = await getAccessTokenSilently();
        authStore.setTokens(userToken, accessToken);
      }
  })

</script>

<template>
  <div v-if="!isAuthenticated">
    <Login></Login>
  </div>
  <div v-if="isAuthenticated && isLoading === false" class="layout-wrapper surface-ground">
    <div class="col-12 layout-topbar bg-white shadow-1">
      <header>
        glennOle
      </header>
      <Logout></Logout>
    </div>
    <div class="flex w-full min-h-full ">
      <div class="hidden m-2 ml-0 layout-menu md:flex flex-grow-0">
        <div class="shadow-1 bg-white">
          <Menu></Menu>
        </div>
      </div>
      <div class="flex layout-main w-full">
        <div class="flex-grow-1 shadow-1 bg-white m-2">
        <main>
          <RouterView />
        </main>
        </div>
      </div>
    </div>
    <div class="flex col-12 layout-footer shadow-1 bg-white justify-content-center align-items-center">
      footer
    </div>
  </div>
</template>

<style>
@import "@/styles.scss";

#app {
  font-weight: normal;
}

</style>
