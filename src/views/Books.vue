<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="addBook">
          <v-icon left>mdi-plus</v-icon>
          Adicionar Livro
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table :headers="headers" :items="books" class="elevation-1">
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editBook(item)">mdi-pencil</v-icon>
        <v-icon small @click="removeLivro(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Book {
  id: string;
  title: string;
}

const books = ref<Book[]>([
  { id: "122112HSSVS", title: 'Livro 1' },
  { id: "A0GV032LLCS", title: 'Livro 2' },
]);

const headers = [
  { text: 'ID', value: 'id' },
  { text: 'Nome', value: 'title' },
  { text: 'Ações', value: 'actions', sortable: false },
];

function addBook() {
  // Lógica para adicionar um novo livro
}

function editBook(item: Book) {
  // Lógica para editar um livro
}

function removeLivro(item: Book) {
  // Lógica para remover um livro
}
</script>

<style scoped>
/* Adicione estilos específicos para o componente aqui, se necessário */
</style>
