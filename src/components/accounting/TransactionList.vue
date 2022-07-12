<template>
    <div>
        <DataTable :value="transactionStore.transactions" responsiveLayout="scroll">
            <Column field="date" header="Dato"></Column>
            <Column field="categoryId" header="Kategori"></Column>
            <Column field="debitAccountId" header="Debet"></Column>
            <Column field="creditAccountId" header="Kredit"></Column>
            <Column field="amount" header="Beløp"></Column>
            <Column field="description" header="Beskrivelse"></Column>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "@/stores/account";
import { useTransactionStore } from '@/stores/transaction';
import { storeToRefs } from 'pinia';
import { computed } from '@vue/reactivity';

const transactionStore = useTransactionStore();

const getTransactions = computed(() => {
    return transactionStore.getTransactions;
})
const transactions = computed(() => {
    return transactionStore.transactions;
})

</script>