<script setup lang="ts">
import { ref } from 'vue';

const items = ref([
  {
    label: 'Økonomi',
    items: [
      {
        label: 'Regnskap',
        icon: 'pi-book',
        to: '/accounting'
      },
      {
        label: 'Oppgjør',
        icon: 'pi-money-bill',
        to: '/settlement'
      }
    ]
  },
  {
    label: 'Vedlikehold',
    items: [
      {
        label: 'Utstyr',
        icon: 'pi-sync',
        to: '/equipment'
      }
    ]
  }
]);

</script>

<template>
  <Menu :model="items"></Menu>
</template>