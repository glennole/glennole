<template>
    <div>
        <DataTable :value="getBankstatements"
            rowGroupMode="subheader" groupRowsBy="month" :expandableRowGroups="true"
            v-model:expandedRowGroups="expandedRowGroups"
            sortMode="single" sortField="date" :sortOrder="1"
            responsiveLayout="scroll">
            <Column field="month" header="Måned"></Column>
            <Column field="date" header="Dato"></Column>
            <Column field="categoryName" header="Kategori"></Column>
            <Column field="description" header="Beskrivelse"></Column>
            <Column field="paidBy" header="Betalt av"></Column>
            <Column field="in" header="Inn"></Column>
            <Column field="out" header="Ut"></Column>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBankstatementsStore } from "@/stores/bankstatements"
import { computed } from '@vue/reactivity';
import type BankStatement from '@/models/accounting/bankstatement.model';

const store = useBankstatementsStore();

const getBankstatements = computed(() => {
    return store.getBankstatements;
})

const formatter = new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK'
})

const expandedRowGroups = ref();

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