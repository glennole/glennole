<template>
    <div class="card">
        <div class="flex flex-column card-container">
            <div class="flex align-items-center justify-content-center" style="height:30vh">
                <div class="text-8xl">glennOle</div>
            </div>
            <div class="flex justify-content-center">
                <Button v-on:click="login" >Logg inn</Button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";

    const { loginWithRedirect, user } = useAuth0();

    function login() {
        loginWithRedirect();
    }

</script>