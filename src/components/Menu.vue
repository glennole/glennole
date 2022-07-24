<script setup lang="ts">
import { ref } from 'vue';
import {PrimeIcons} from 'primevue/api';

const items = ref([
  {
    label: 'Økonomi',
    items: [
      {
        label: 'Regnskap',
        icon: PrimeIcons.BOOK,
        to: '/accounting'
      },
      {
        label: 'Kategorier',
        icon: PrimeIcons.TAGS,
        to: '/categories'
      },
      {
        label: 'Oppgjør',
        icon: PrimeIcons.MONEY_BILL,
        to: '/refund'
      }
    ]
  },
  {
    label: 'Vedlikehold',
    items: [
      {
        label: 'Utstyr',
        icon: PrimeIcons.SYNC,
        to: '/equipment'
      }
    ]
  }
]);

</script>

<template>
  <Menu :model="items"></Menu>
</template>