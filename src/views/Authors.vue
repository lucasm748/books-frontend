<template>
  <v-container>
    <DefaultDataTable
      :headers="headers"
      :items="authors"
      @edit="editAuthor"
      @remove="confirmRemoveAuthor"
      :card-title="'Autores Cadastrados'"
    />
    <v-btn class="mt-4" color="blue" dark @click="openNewAuthorModal"
      >Novo Autor</v-btn
    >
    <v-btn class="mt-4 ml-2" color="green" dark @click="emitReport"
      >Emitir Relatório</v-btn
    >
    <EditAuthorModal
      :isVisible="isEditModalVisible"
      :author="selectedAuthor"
      :mode="modalMode"
      @update:isVisible="isEditModalVisible = $event"
      @save="handleSave"
    />
    <v-dialog v-model="isConfirmDialogVisible" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Exclusão</v-card-title>
        <v-card-text>Tem certeza de que deseja excluir este autor?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            variant="text"
            @click="isConfirmDialogVisible = false"
            >Cancelar</v-btn
          >
          <v-btn color="red darken-1" variant="text" @click="removeAuthor"
            >Excluir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import DefaultDataTable from '@/components/DefaultDataTable.vue';
import EditAuthorModal from '@/components/EditAuthorModal.vue';
import { useSnackbar } from '@/services/eventBus';
import { Author } from '@/types/Author';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { onMounted, ref } from 'vue';

const authors = ref<Author[]>([]);

const headers = ref([
  {
    key: 'id',
    title: 'ID',
    align: 'start' as const,
    sortable: false,
    width: '20%',
  },
  { key: 'name', title: 'Nome', align: 'start' as const },
  { key: 'actions', title: 'Ações', sortable: false, width: '10%' },
]);

const { showSnackbar } = useSnackbar();

const isEditModalVisible = ref(false);
const isConfirmDialogVisible = ref(false);
const selectedAuthor = ref<Author>({ id: '', name: '' });
const modalMode = ref<'edit' | 'create'>('edit');

async function fetchAuthors() {
  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + '/authors');
    authors.value = response.data?.authors;
  } catch (error) {
    showSnackbar('Ocorreu um erro ao buscar os autores.', 'error');
  }
}

function openNewAuthorModal() {
  selectedAuthor.value = { id: '', name: '' };
  modalMode.value = 'create';
  isEditModalVisible.value = true;
}

function editAuthor(item: Author) {
  selectedAuthor.value = { ...item };
  modalMode.value = 'edit';
  isEditModalVisible.value = true;
}

function confirmRemoveAuthor(item: Author) {
  selectedAuthor.value = { ...item };
  isConfirmDialogVisible.value = true;
}

async function handleSave(author: Author) {
  if (modalMode.value === 'edit') {
    await updateAuthor(author);
  } else {
    await createAuthor(author);
  }
}

async function updateAuthor(updatedAuthor: Author) {
  try {
    const response = await axios.put(
      import.meta.env.VITE_API_URL + `/authors/${updatedAuthor.id}`,
      updatedAuthor,
    );
    const index = authors.value.findIndex(
      (author) => author.id === updatedAuthor.id,
    );
    if (index !== -1) {
      authors.value[index] = response.data.author;
      showSnackbar('Autor atualizado com sucesso!', 'success');
      await fetchAuthors();
    }
  } catch (error) {
    showSnackbar('Ocorreu um erro ao atualizar o autor.', 'error');
  }
}

async function createAuthor(newAuthor: Author) {
  try {
    await axios.post(import.meta.env.VITE_API_URL + '/authors', newAuthor);
    showSnackbar('Autor criado com sucesso!', 'success');
    await fetchAuthors();
  } catch (error) {
    showSnackbar('Ocorreu um erro ao criar o autor.', 'error');
  }
}

async function removeAuthor() {
  try {
    await axios.delete(
      import.meta.env.VITE_API_URL + `/authors/${selectedAuthor.value.id}`,
    );
    showSnackbar('Autor removido com sucesso!', 'success');
    await fetchAuthors();
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      showSnackbar(error.response.data.message, 'error');
    } else {
      showSnackbar('Ocorreu um erro ao remover o autor.', 'error');
    }
  } finally {
    isConfirmDialogVisible.value = false;
  }
}

function emitReport() {
  const doc = new jsPDF();
  doc.text('Relatório de Autores', 14, 16);
  (doc as any).autoTable({
    head: [['ID', 'Nome']],
    body: authors.value.map((author) => [author.id, author.name]),
    startY: 20,
  });
  doc.save('relatorio_autores.pdf');
  showSnackbar('Relatório emitido com sucesso!', 'success');
}

onMounted(() => {
  fetchAuthors();
});
</script>

<style scoped></style>
