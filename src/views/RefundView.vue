<template>
    <h1>Oppgjør</h1>
    <UserRefundList></UserRefundList>
</template>

<script setup lang="ts">
    import UserRefundList from '@/components/accounting/UserRefundList.vue';
    import { useRefundStore } from '@/stores/refund';

    const store = useRefundStore();
    store.fetchUserRefunds();

</script>