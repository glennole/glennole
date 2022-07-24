<template>
<div class="grid">
    <div class="col-12">
        <h1>Regnskap</h1>
        <AccountingListVue></AccountingListVue>
    </div>
    <div class="col-12" v-if="refundStore.getAccountingRefunds.length > 0">
        <h1>Oppgjør</h1>
        <AccountingRefundList></AccountingRefundList>
    </div>
    <div class="col-12" v-if="store.accounting">
        <h1>Konti</h1>
        <AccountListVue></AccountListVue>
    </div>
    <div class="col-12" v-if="store.accounting && accountStore.account">
        <h1>Kontoutskrift</h1>
        <BankStatementListVue></BankStatementListVue>
    </div>
</div>
</template>

<script setup lang="ts">
import AccountingListVue from '@/components/accounting/AccountingList.vue';
import AccountListVue from '@/components/accounting/AccountList.vue'
import BankStatementListVue from '@/components/accounting/BankStatementList.vue';
import AccountingRefundList from '@/components/accounting/AccountingRefundList.vue';
import { useAccountingStore } from '@/stores/accounting';
import { useAccountStore } from '@/stores/account';
import { useRefundStore } from '@/stores/refund';

const store = useAccountingStore();
const accountStore = useAccountStore();
const refundStore = useRefundStore();
</script>