<template>
    <Toolbar>
        <template #start>
            <Button aria-label="Opprett nytt regnskap" icon="pi pi-plus" class="p-button-success mr-2" @click="openAccountingDialog" />
            <Button aria-label="Koble til delt regnskap" icon="pi pi-share-alt" class="p-button-success mr-2" @click="openJoinSharedAccountingDialog" />
        </template>
    </Toolbar>

    <div>
        <DataTable :value="accountings" v-model:selection="selectedAccounting" selectionMode="single"
            @row-select="onRowSelect" dataKey="id" responsiveLayout="scroll">
            <Column field="name" header="Navn"></Column>
            <Column field="description" header="Beskrivelse"></Column>

            <Column bodyStyle="text-align:center">
                <template #body="slotProps">
                    <Button 
                        icon="pi pi-money-bill" 
                        class="p-button-rounded p-button-success" 
                        v-if="slotProps.data.isShared"
                        @click="openPaymentDialog(slotProps.data)" />
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

    <Dialog :visible="accountingDialog" :style="{width: '450px'}" header="Opprett nytt regnskap" :modal="true" class="p-fluid" @update:visible="hideAccountingDialog">
        <div class="field">
            <label for="name">Navn</label>
            <InputText id="name" v-model.trim="accounting.name" :class="{'p-invalid': submitted && accounting.name === ''}" />
        </div>
        <div class="field">
            <label for="description">Beskrivelse</label>
            <InputText id="description" v-model.trim="accounting.description" :class="{'p-invalid': submitted && accounting.description === '' }" />
        </div>
        <div class="field-checkbox">
            <Checkbox id="isShared" v-model="accounting.isShared" binary />
            <label for="isShared">Delt</label>
        </div>
        <div class="field" v-if="accounting.isShared === true">
            <label for="secret">Nøkkel til deling</label>
            <InputText id="secret" v-model.trim="accounting.token" :class="{'p-invalid': submitted && accounting.token === '' && accounting.isShared}" />
        </div>
        <template #footer>
            <Button label="Avbryt" icon="pi pi-times" class="p-button-text" @click="hideAccountingDialog" />
            <Button label="Lagre" icon="pi pi-check" class="p-button-text" @click="createAccounting" />
        </template>
    </Dialog>

    <Dialog :visible="joinSharedAccountingDialog" :style="{width: '450px'}" header="Bli med i et delt regnskap" :modal="true" class="p-fluid" @update:visible="hideJoinSharedAccountingDialog">
        <div class="field">
            <label for="secret">Nøkkel til delt regnskap</label>
            <InputText id="secret" v-model.trim="sharedAccountingToken" :class="{'p-invalid': submitted && sharedAccountingToken === ''}" />
        </div>
        <template #footer>
            <Button label="Avbryt" icon="pi pi-times" class="p-button-text" @click="hideJoinSharedAccountingDialog" />
            <Button label="Lagre" icon="pi pi-check" class="p-button-text" @click="joinSharedAccounting" />
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

const sharedAccountingToken = ref<string>();
const joinSharedAccountingDialog = ref<boolean>();

const accounting = ref();
const accountingDialog = ref<boolean>();

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

const openJoinSharedAccountingDialog = () => {
    submitted.value = false;
    sharedAccountingToken.value = '';
    joinSharedAccountingDialog.value = true;
}
const hideJoinSharedAccountingDialog = () => {
    joinSharedAccountingDialog.value = false;
    submitted.value = false;
}

const joinSharedAccounting = () => {
    submitted.value = true;
    if(sharedAccountingToken.value !== ''){
        // store.joinSharedAccounting(accounting.value);
        console.log(sharedAccountingToken.value);
        joinSharedAccountingDialog.value = false;
    }
}

const openAccountingDialog = () => {
    accounting.value = { name: '', description: '', token: '', isShared: true, id:0, userId: userStore.user?.id};
    submitted.value = false;
    accountingDialog.value = true;
}
const hideAccountingDialog = () => {
    accountingDialog.value = false;
    submitted.value = false;
}

const createAccounting = () => {
    submitted.value = true;
    if(accounting.value.name !== '' && accounting.value.description !== '' && (!accounting.value.isShared || accounting.value.token !== '')){
        store.createAccounting(accounting.value);
        accountingDialog.value = false;
    }
}

const openPaymentDialog = (accounting: IAccounting) => {
    let date = new Date();
    submitted.value = false;
    paymentAccountingId.value = accounting.id;
    paymentDate.value = new Date(date.getFullYear(), date.getMonth(), 1);
    paymentDialog.value = true;
}
const hidePaymentDialog = (accounting: IAccounting) => {
    paymentDialog.value = false;
    submitted.value = false;
}

const createPayment = () => {
    submitted.value = true;
    if(paymentDate.value){
        refundStore.createRefund(paymentAccountingId.value, paymentDate.value);
        paymentDialog.value = false;
    }
}
</script>