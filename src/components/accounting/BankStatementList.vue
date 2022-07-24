<template>
    <div class="card">
        <Toolbar v-if="accountStore.account.type === 2">
            <template #start>
                <Button label="Ny" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
            </template>
        </Toolbar>
        <DataTable :value="getBankstatements"
            rowGroupMode="subheader" groupRowsBy="month" :expandableRowGroups="true"
            v-model:expandedRowGroups="expandedRowGroups"
            sortMode="single" sortField="date" :sortOrder="1"
            responsiveLayout="scroll">
            <Column field="month" header="Måned"></Column>
            <Column field="date" header="Dato">
                <template #body="{data}">
                    <span>{{formatDate(data.date)}}</span>
                </template>
            </Column>
            <Column field="categoryName" header="Kategori"></Column>
            <Column field="description" header="Beskrivelse"></Column>
            <Column field="paidBy" header="Betalt av"></Column>
            <Column field="in" header="Inn">
                <template #body="{data}">
                    <span>{{formatter.format(data.in)}}</span>
                </template>
            </Column>
            <Column field="out" header="Ut">
                <template #body="{data}">
                    <span>{{formatter.format(data.out)}}</span>
                </template>
            </Column>
            <template #groupheader="slotProps">
                <span class="image-text">{{slotProps.data.month}}</span>
            </template>
            <template #groupfooter="slotProps">
                <td colspan="7">
                    <div class="card">
                        <div class="flex justify-content-end flex-wrap card-container blue-container">
                            <div v-for="payer in getPayersByMonth(slotProps.data.month)">
                                <div class="flex-initial flex align-items-center justify-content-center m-2 px-5 py-3 border-round">
                                    <span class="payer">{{ payer }}:</span>
                                    <span class="amount">{{calculateMonthByPayer(slotProps.data.month, payer)}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </template>
            <template #footer>
                    <div class="card">
                        <div class="flex justify-content-end flex-wrap card-container blue-container">
                            <div v-for="payer in getAllPayers()">
                                <div class="flex-initial flex align-items-center justify-content-center m-2 px-5 py-3 border-round">
                                    <span class="payer">{{ payer }}:</span>
                                    <span class="amount">{{calculateTotalByPayer(payer)}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
            </template>
        </DataTable>
    </div>

    <Dialog :visible="purchaseGoodsDialog" :style="{width: '450px'}" header="Opprett et kjøp" :modal="true" class="p-fluid" @update:visible="hideDialog">
        <div>
            <label for="date">Dato</label>
            <Calendar id="date" :showIcon="true" v-model="purchaseGoods.date" required="true" dateFormat="dd.mm.yy" :class="{'p-invalid': submitted && !purchaseGoods.date}"></Calendar>
            <small class="p-error" v-if="submitted && !purchaseGoods.date">Dato er påkrevd.</small>
        </div>
        <div class="field">
            <label for="amount">Beløp</label>
            <InputNumber id="amount" v-model="purchaseGoods.amount" required="true" mode="currency" currency="NOK" locale="nb-NO" :class="{'p-invalid': submitted && !purchaseGoods.amount}"/>
            <small class="p-error" v-if="submitted && !purchaseGoods.amount">Beløp er påkrevd.</small>
        </div>
        <div class="field">
            <label for="category">Kategori</label>
            <Dropdown id="category" v-model="purchaseGoods.categoryId" :options="categoryStore.getCategories" :class="{'p-invalid': submitted && !purchaseGoods.categoryId}" required="true" optionValue="id" optionLabel="name" placeholder="Velg en kategori..."></Dropdown>
            <small class="p-error" v-if="submitted && !purchaseGoods.categoryId">Kategori er påkrevd.</small>
        </div>
        <div class="field">
            <label for="payer">Betaler</label>
            <Dropdown id="payer" v-model="purchaseGoods.userId" 
            :options="userStore.getSelectedAccountingUsers" :class="{'p-invalid': submitted && !purchaseGoods.userId}"
            required="true" optionValue="id" optionLabel="name" placeholder="Velg en betaler..."></Dropdown>
            <small class="p-error" v-if="submitted && !purchaseGoods.userId">Betaler er påkrevd.</small>
        </div>
        <div class="field">
            <label for="description">Beskrivelse</label>
            <InputText id="description" v-model.trim="purchaseGoods.description" :class="{'p-invalid': submitted && !purchaseGoods.description}" />
        </div>
        <template #footer>
            <Button label="Avbryt" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
            <Button label="Lagre" icon="pi pi-check" class="p-button-text" @click="addPurchaseGoods" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBankstatementsStore } from "@/stores/bankstatements"
import { useAccountingStore } from '@/stores/accounting';
import { useAccountStore } from '@/stores/account';
import { useUserStore } from '@/stores/user';
import { useCategoryStore } from '@/stores/category';
import { computed } from '@vue/reactivity';
import type BankStatement from '@/models/accounting/bankstatement.model';
import type PurchaseGoods from '@/models/accounting/purchasegoods.model';

const store = useBankstatementsStore();
const accountingStore = useAccountingStore();
const userStore = useUserStore();
const categoryStore = useCategoryStore();
const accountStore = useAccountStore();

const getBankstatements = computed(() => {
    return store.getBankstatements;
})

const formatter = new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK'
})

const purchaseGoods = ref<PurchaseGoods>();
const purchaseGoodsDialog = ref<boolean>();
const submitted = ref<boolean>(false);

const openNew = () => {
    if(accountingStore.accounting) {
        purchaseGoods.value = { accountingId: accountingStore.accounting.id, amount: null, categoryId: null, date: new Date(), userId: userStore.user.id, divide: true, description: ''};
        submitted.value = false;
        purchaseGoodsDialog.value = true;
    }
}

const hideDialog = () => {
    purchaseGoodsDialog.value = false;
    submitted.value = false;
}

const expandedRowGroups = ref();

const formatDate = (date: Date) =>{
    return new Date(date).toLocaleDateString('nb-NO');
}

function calculateMonthByPayer(month: string, payer: string) {
    return formatter.format(getBankstatements.value
        .filter((bankstatement: BankStatement) => bankstatement.paidBy === payer && bankstatement.month === month).
        reduce((totalAmount, bankstatement) => totalAmount + bankstatement.in, 0))
}

function calculateTotalByPayer(payer: string) {
    return formatter.format(getBankstatements.value
        .filter((bankstatement: BankStatement) => bankstatement.paidBy === payer).
        reduce((totalAmount, bankstatement) => totalAmount + bankstatement.in, 0))
}

function getPayersByMonth(month: string) {
    return getBankstatements.value
        .filter((bankstatement: BankStatement) => bankstatement.month === month)
        .map((bankstatement: BankStatement) => bankstatement.paidBy)
        .filter((value, index, self) => self.indexOf(value) === index)
}

function getAllPayers() {
    return getBankstatements.value
        .map((bankstatement: BankStatement) => bankstatement.paidBy)
        .filter((value, index, self) => self.indexOf(value) === index)
}

function addPurchaseGoods() {
    submitted.value = true;
    if(purchaseGoods.value.date && purchaseGoods.value.amount && purchaseGoods.value.categoryId && purchaseGoods.value.userId) {
        accountingStore.registerPurchaseGoods(purchaseGoods.value);
        purchaseGoodsDialog.value = false;
        submitted.value = false;
        purchaseGoods.value = {}
    }
}

</script>

<style scoped>
.payer {
    font-weight: bold;
    font-size: 1.1rem;
    padding-right: 10px;
}
.amount {
    font-size: 1rem;
}
</style>