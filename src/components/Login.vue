<template>
    <div>
        <button v-on:click="login" >Login with Redirect</button>
    </div>
</template>
<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";

    const { loginWithRedirect, user } = useAuth0();

    function login() {
        loginWithRedirect();
    }

</script>