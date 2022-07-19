<template>
    <div class="card">
        <Toolbar>
            <template #start>
                <Button label="Ny" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
            </template>
        </Toolbar>
        <DataTable :value="getCategories"
            sortMode="single" sortField="name" :sortOrder="1"
            responsiveLayout="scroll">
            <Column field="name" header="Navn"></Column>
        </DataTable>
    </div>

    <Dialog :visible="categoryDialog" :style="{width: '450px'}" header="Opprett ny kategori" :modal="true" class="p-fluid">
        <div class="field">
            <label for="name">Navn</label>
            <InputText id="name" v-model.trim="category.name" required="true" autofocus :class="{'p-invalid': submitted && !category.name}" />
            <small class="p-error" v-if="submitted && !category?.name">Navn er påkrevd.</small>
        </div>
        <template #footer>
            <Button label="Avbryt" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
            <Button label="Lagre" icon="pi pi-check" class="p-button-text" @click="saveCategory" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useCategoryStore } from '@/stores/category';
import { computed } from '@vue/reactivity';
import type Category from '@/models/accounting/category.model';

onMounted(() => {
    store.fetchCategories();
})

onUnmounted(() => {
    store.$reset();
})
const getCategories = computed(() => {
    return store.getCategories;
})

const store = useCategoryStore();
const category = ref<Category>();
const categoryDialog = ref<boolean>();
const submitted = ref<boolean>(false);

const openNew = () => {
    category.value = { name: '' };
    submitted.value = false;
    categoryDialog.value = true;
}

const hideDialog = () => {
    categoryDialog.value = false;
    submitted.value = false;
}

const saveCategory = () => {
    submitted.value = true;

    if (category.value?.name.trim()){
        if(category.value.id) {
            store.updateCategory(category.value)
        }
        else {
            //Add
            store.addCategory(category.value)
        }
        categoryDialog.value = false;
        category.value = { name: '' }
    }
}

function deleteCategory(categoryId: number){

}


</script>