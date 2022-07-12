<template>
    <div>
        <DataTable :value="accountings" v-model:selection="selectedAccounting" selectionMode="single"
            @row-select="onRowSelect" dataKey="id" responsiveLayout="scroll">
            <Column field="name" header="Navn"></Column>
            <Column field="description" header="Beskrivelse"></Column>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAccountingStore } from "@/stores/accounting";
import { useAccountStore } from '@/stores/account';
import { useTransactionStore } from '@/stores/transaction';
import { computed } from '@vue/reactivity';


const selectedAccounting = ref();
const store = useAccountingStore();
const accountStore = useAccountStore();
const transactionStore = useTransactionStore();

const onRowSelect = () => {
    store.setAccounting(selectedAccounting.value.id);
    accountStore.fetchAccounts(selectedAccounting.value.id)
    transactionStore.$reset();
}

const accountings = computed(() => {
    return store.getAccountings
})

onMounted(() => {
    store.fetchAccountings();
})

onUnmounted(() => {
    store.$reset();
    accountStore.$reset();
    transactionStore.$reset();

})
</script>