<template>
<div class="grid">
    <div class="col-6">
        <h1>Regnskap</h1>
        <AccountingListVue></AccountingListVue>
    </div>
    <div class="col-6">
        <h1>Konti</h1>
        <AccountListVue></AccountListVue>
    </div>
</div>
 <div class="grid">
    <div class="col-8">
        <h1>Kontoutskrift</h1>
        <BankStatementListVue></BankStatementListVue>
    </div>
    <div class="col-4">
        <h1>Kategorier</h1>
        <CategoryListVue></CategoryListVue>
    </div>
</div>
</template>

<script setup lang="ts">
import AccountingListVue from '@/components/accounting/AccountingList.vue';
import AccountListVue from '@/components/accounting/AccountList.vue'
import BankStatementListVue from '@/components/accounting/BankStatementList.vue';
import CategoryListVue from '@/components/accounting/CategoryList.vue';
</script>