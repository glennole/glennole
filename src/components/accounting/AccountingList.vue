<template>
    <div>
        <DataTable :value="accountings" v-model:selection="selectedAccounting" selectionMode="single"
            @row-select="onRowSelect" dataKey="id" responsiveLayout="scroll">
            <Column field="name" header="Navn"></Column>
            <Column field="description" header="Beskrivelse"></Column>

            <Column bodyStyle="text-align:center">
                <template #body="slotProps">
                    <Button icon="pi pi-money-bill" class="p-button-rounded p-button-success" @click="openPaymentDialog(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog :visible="paymentDialog" :style="{width: '450px'}" header="Opprett oppgjør" :modal="true" class="p-fluid" @update:visible="hidePaymentDialog">
        <div class="font-italic pb-5">Beregn oppgjør ift transaksjoner før angitt dato.</div>
        <div class="field">
            <label for="date">Dato</label>
           <Calendar id="date" :showIcon="true" v-model="paymentDate" required="true" dateFormat="dd.mm.yy" :class="{'p-invalid': submitted && !paymentDate}"></Calendar>
            <small class="p-error" v-if="submitted && !paymentDate">Dato er påkrevd.</small>
        </div>
        <template #footer>
            <Button label="Avbryt" icon="pi pi-times" class="p-button-text" @click="hidePaymentDialog" />
            <Button label="Lagre" icon="pi pi-check" class="p-button-text" @click="createPayment" />
        </template>
    </Dialog>

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAccountingStore } from "@/stores/accounting";
import { useAccountStore } from '@/stores/account';
import { useUserStore } from '@/stores/user';
import { useBankstatementsStore } from '@/stores/bankstatements';
import { useRefundStore } from '@/stores/refund';
import { computed } from '@vue/reactivity';
import type IRefund from '@/models/accounting/refund.model';
import type IAccounting from '@/models/accounting/accounting.model';
import { useCategoryStore } from '@/stores/category';


const selectedAccounting = ref();
const store = useAccountingStore();
const accountStore = useAccountStore();
const bankStatementStore = useBankstatementsStore();
const userStore = useUserStore();
const refundStore = useRefundStore();
const categoryStore = useCategoryStore();

const paymentAccountingId = ref<number>();
const paymentDate = ref<Date>();
const paymentDialog = ref<boolean>();
const submitted = ref<boolean>(false);

const onRowSelect = () => {
    store.setAccounting(selectedAccounting.value.id);
    accountStore.fetchAccounts(selectedAccounting.value.id)
    userStore.fetchSelectedAccountingUsers(selectedAccounting.value.id)
    refundStore.fetchAccountingRefunds(selectedAccounting.value.id)
    bankStatementStore.$reset();
}

const accountings = computed(() => {
    return store.getAccountings
})

onMounted(() => {
    store.fetchAccountings();
    categoryStore.fetchCategories();
})

onUnmounted(() => {
    store.$reset();
    accountStore.$reset();
    bankStatementStore.$reset();
    refundStore.accountingRefunds = [];

})

const openPaymentDialog = (accounting: IAccounting) => {
    let date = new Date();
    paymentAccountingId.value = accounting.id;
    paymentDate.value = new Date(date.getFullYear(), date.getMonth(), 1);
    paymentDialog.value = true;
}
const hidePaymentDialog = (accounting: IAccounting) => {
    paymentDialog.value = false;
}

const createPayment = () => {
    submitted.value = true;
    if(paymentDate.value){
        refundStore.createRefund(paymentAccountingId.value, paymentDate.value);
        paymentDialog.value = false;
    }
}
</script>