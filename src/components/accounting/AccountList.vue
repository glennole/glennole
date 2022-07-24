<template>
    <div>
        <DataTable :value="store.accounts" responsiveLayout="scroll" v-model:selection="selectedAccount" selectionMode="single"
            @row-select="onRowSelect" dataKey="id" >
            <Column field="name" header="Navn"></Column>
            <Column field="description" header="Beskrivelse"></Column>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAccountStore } from "@/stores/account";
import { useTransactionStore } from '@/stores/transaction';
import { useBankstatementsStore } from '@/stores/bankstatements';
import { storeToRefs } from 'pinia';


const selectedAccount= ref();
const store = useAccountStore();
const bankstatementsStore = useBankstatementsStore();
const transactionStore = useTransactionStore();

store.$subscribe((mutation, state) => {
    if(!state.account){
        selectedAccount.value = {};
    }
})

const onRowSelect = () => {
    store.setAccount(selectedAccount.value.id);
    transactionStore.fetchTransactions(selectedAccount.value.id);
    bankstatementsStore.fetchBankStatements(selectedAccount.value.id);
}

</script>