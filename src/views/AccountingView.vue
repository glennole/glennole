<template>
<h1>Regnskap</h1>
<AccountingListVue></AccountingListVue>
<h1>Konti</h1>
<AccountListVue></AccountListVue>
<h1>Kontoutskrift</h1>
<TransactionListVue></TransactionListVue>
</template>

<script setup lang="ts">
import AccountingListVue from '@/components/accounting/AccountingList.vue';
import AccountListVue from '@/components/accounting/AccountList.vue'
import TransactionListVue from '@/components/accounting/TransactionList.vue';
</script>