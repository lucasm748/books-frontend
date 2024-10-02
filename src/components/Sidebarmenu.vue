<template>
  <v-navigation-drawer>
    <v-list>
      <v-list-item
        title="Autores"
        @click="navigateTo('/autores')"
      ></v-list-item>
      <v-list-item
        title="Assuntos"
        @click="navigateTo('/assuntos')"
      ></v-list-item>
      <v-list-item title="Livros" @click="navigateTo('/livros')"></v-list-item>
      <v-list-item
        title="Relatório"
        @click="navigateTo('/relatorio')"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function navigateTo(path: string) {
  router.push(path);
}
</script>

<style scoped>
.v-list-item:hover {
  background-color: blueviolet !important;
  color: white !important;
}
</style>
