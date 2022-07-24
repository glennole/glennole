<template>
    <div>
        <DataTable :value="refunds" responsiveLayout="scroll">
            <Column field="createdAt" header="Opprettet dato">
                <template #body="{data}">
                    <span>{{formatDate(data.createdAt)}}</span>
                </template>
            </Column>
            <Column field="payer" header="Betaler"></Column>
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
</template>

<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { useAccountStore } from "@/stores/account";
import { useRefundStore } from '@/stores/refund';
import { storeToRefs } from 'pinia';

const refundStore = useRefundStore();

const refunds = computed(() => {
    return refundStore.getAccountingRefunds.filter(refund => refund.state != 3)
})

const formatDate = (date: Date) =>{
    return new Date(date).toLocaleDateString('nb-NO');
}

const formatter = new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK'
})

</script>