<template>
  <v-card :title="cardTitle" flat>
    <template v-slot:text>
      <v-text-field
        v-model="search"
        label="Pesquisar"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
    </template>

    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      :items-per-page="itemsPerPage"
      :page.sync="page"
      :items-per-page-options="[5, 10, 15]"
      :items-per-page-text="'Itens por página:'"
      :page-text="`Página: ${page} de ${Math.ceil(items.length / itemsPerPage)}`"
      :no-data-text="'Nenhum dado encontrado'"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" color="blue" @click="$emit('edit', item)"
          >mdi-pencil</v-icon
        >
        <v-icon small color="red" @click="$emit('remove', item)"
          >mdi-delete</v-icon
        >
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';

interface Header {
  key: string;
  title: string;
  align?: 'start' | 'end' | 'center';
  sortable?: boolean;
}

interface Item {
  [key: string]: any;
}

defineProps<{
  headers: Header[];
  items: Item[];
  cardTitle: string;
}>();

const search = ref('');
const itemsPerPage = ref(10);
const page = ref(1);
</script>

<style scoped></style>
