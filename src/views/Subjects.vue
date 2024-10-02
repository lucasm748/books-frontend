<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="addAssunto">
          <v-icon left>mdi-plus</v-icon>
          Adicionar Assunto
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table :headers="headers" :items="subjects" class="elevation-1">
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editAssunto(item)">mdi-pencil</v-icon>
        <v-icon small @click="removeAssunto(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Subject {
  id: string;
  description: string;
}

const subjects = ref<Subject[]>([
  { id: "122112HSSVS", description: 'Assunto 1' },
  { id: "A0GV032LLCS", description: 'Assunto 2' },
]);

const headers = [
  { text: 'ID', value: 'id' },
  { text: 'Descrição', value: 'description' },
  { text: 'Ações', value: 'actions', sortable: false },
];

function addAssunto() {
  // Lógica para adicionar um novo assunto
}

function editAssunto(item: Subject) {
  // Lógica para editar um assunto
}

function removeAssunto(item: Subject) {
  // Lógica para remover um assunto
}
</script>

<style scoped>
/* Adicione estilos específicos para o componente aqui, se necessário */
</style>
