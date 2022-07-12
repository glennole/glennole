<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { useAuthStore } from '@/stores/auth';

    const { user } = useAuth0();
    const store = useAuthStore();

</script>

<template>
    <H1>
        User info
    </H1>
    <code>{{ user }}</code>
    <p>Access token: {{ store.getAuthToken }}</p>
    <p>User token: {{ store.getUserToken }}</p>
</template>