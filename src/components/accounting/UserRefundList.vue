<template>
    <div>
        <DataTable :value="refundStore.getUserRefunds" responsiveLayout="scroll">
            <Column field="createdAt" header="Opprettet dato">
                <template #body="{data}">
                    <span>{{formatDate(data.createdAt)}}</span>
                </template>
            </Column>
            <Column field="payer" header="Betaler">
                <template #body="{data}">
                    <Button v-if="data.state === 1" class="p-button-rounded p-button-success" @click="openNew(data)">Betal ({{ data.payer }})</Button>
                    <span v-else>{{data.payer}}</span>
                </template>
            </Column>
            <Column field="receiver" header="Mottaker"></Column>
            <Column field="description" header="Beskrivelse"></Column>
            <Column field="amount" header="Beløp">
                <template #body="{data}">
                    <span>{{formatter.format(data.amount)}}</span>
                </template>
            </Column>
            <Column header="Status">
                <template #body="{data}">
                    <i class="pi pi-check" v-if="data.state === 2"></i>
                    <i class="pi pi-times" v-if="data.state === 3"></i>
                    <i class="pi pi-minus" v-if="data.state === 1"></i>
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog :visible="refundDialog" :style="{width: '450px'}" header="Opprett ny kategori" :modal="true" class="p-fluid" @update:visible="hideDialog">
        <div>
            <label for="date">Dato</label>
            <Calendar id="date" :showIcon="true" v-model="payDate" required="true" dateFormat="dd.mm.yy" :class="{'p-invalid': submitted && !payDate}"></Calendar>
            <small class="p-error" v-if="submitted && !payDate">Dato er påkrevd.</small>
        </div>
        <div class="field">
            <label for="amount">Beløp</label>
            <InputNumber id="amount" v-model="selectedRefund.amount" required="true" :readonly="true" />
        </div>
        <div class="field">
            <label for="category">Kategori</label>
            <Dropdown id="category" v-model="selectedCategoryId" :options="categoryStore.getCategories" :class="{'p-invalid': submitted && !selectedCategoryId}" required="true" optionValue="id" optionLabel="name" placeholder="Velg en kategori..."></Dropdown>
            <small class="p-error" v-if="submitted && !selectedCategoryId">Kategori er påkrevd.</small>
        </div>
        <template #footer>
            <Button label="Avbryt" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
            <Button label="Lagre" icon="pi pi-check" class="p-button-text" @click="pay" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type IRefund from "@/models/accounting/refund.model";
import { useRefundStore } from '@/stores/refund';
import { useUserStore } from "@/stores/user";
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '@/stores/category';
import type Category from '@/models/accounting/category.model';

const payDate = ref<Date>();

const refundStore = useRefundStore();
const userStore = useUserStore();
const categoryStore = useCategoryStore();

const selectedRefund = ref<IRefund>();
const selectedCategoryId = ref<number>();
const refundDialog = ref<boolean>();
const submitted = ref<boolean>(false)

onMounted(() => {
    if(categoryStore.getCategories.length === 0){
        categoryStore.fetchCategories();
    }
})

const openNew = (refund: IRefund) => {
    payDate.value = new Date();
    selectedRefund.value = refund;
    selectedCategoryId.value = undefined;
    submitted.value = false;
    refundDialog.value = true;
}

const hideDialog = () => {
    refundDialog.value = false;
    selectedRefund.value = undefined;
    selectedCategoryId.value = undefined;
    submitted.value = false;
}

const pay = () =>{
    if(selectedRefund.value && selectedCategoryId.value) {
        refundStore.payRefund(selectedRefund.value, selectedCategoryId.value, payDate.value);  

        refundDialog.value = false;
        selectedRefund.value = undefined;
        selectedCategoryId.value = undefined;
    }
}

const formatDate = (date: Date) =>{
    return new Date(date).toLocaleDateString('nb-NO');
}

const formatter = new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK'
})
</script>