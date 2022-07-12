<template>
    <div>
        <button v-on:click="logout_click()">Logout</button>
    </div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';

    const { logout } = useAuth0();
    function logout_click () {
        logout({ returnTo: window.location.origin });
    }

</script>