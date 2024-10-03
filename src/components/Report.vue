<template>
  <v-container>
    <v-card>
      <v-card-title>Relatório</v-card-title>
      <v-card-text>
        <v-btn color="green" dark @click="generateReport"
          >Gerar Relatório</v-btn
        >
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useSnackbar } from '@/services/eventBus';
import axios from 'axios';

const { showSnackbar } = useSnackbar();

async function generateReport() {
  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + '/report', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'relatorio.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSnackbar('Relatório gerado com sucesso!', 'success');
  } catch (error) {
    showSnackbar('Ocorreu um erro ao gerar o relatório.', 'error');
  }
}
</script>

<style scoped></style>
