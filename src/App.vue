<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar title="Catálogo de Livros" class="px-3 bg-orange">
        <v-spacer></v-spacer>
        <v-btn :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" text="Toggle Theme" slim
          @click="onClick"></v-btn>
      </v-app-bar>
      <Sidebarmenu />
      <v-main>
        <v-container>
          <router-view />
          <v-snackbar v-model="snackbarVisible" :timeout="2000" :color="snackbarColor" top right>
            {{ snackbarMessage }}
            <template v-slot:actions>
              <v-btn color="white" variant="text" @click="snackbarVisible = false">
                Fechar
              </v-btn>
            </template>
          </v-snackbar>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Sidebarmenu from './components/Sidebarmenu.vue';
import { useSnackbar } from './services/eventBus';

const { snackbarVisible, snackbarMessage, snackbarColor } = useSnackbar();

const theme = ref('dark');

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}

</script>
