<template>
  <v-container>
    <DefaultDataTable
      :headers="headers"
      :items="books"
      @edit="editBook"
      @remove="confirmRemoveBook"
      :card-title="'Livros Cadastrados'"
    />
    <v-btn class="mt-4" color="blue" dark @click="openNewBookModal"
      >Novo Livro</v-btn
    >
    <v-btn class="mt-4 ml-2" color="green" dark @click="emitReport"
      >Emitir Relatório</v-btn
    >
    <EditBookModal
      :isVisible="isEditModalVisible"
      :book="selectedBook"
      :mode="modalMode"
      @update:isVisible="isEditModalVisible = $event"
      @save="handleSave"
    />
    <v-dialog v-model="isConfirmDialogVisible" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Exclusão</v-card-title>
        <v-card-text>Tem certeza de que deseja excluir este livro?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            variant="text"
            @click="isConfirmDialogVisible = false"
            >Cancelar</v-btn
          >
          <v-btn color="red darken-1" variant="text" @click="removeBook"
            >Excluir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import DefaultDataTable from '@/components/DefaultDataTable.vue';
import EditBookModal from '@/components/EditBookModal.vue';
import { useSnackbar } from '@/services/eventBus';
import { Book } from '@/types/Book';
import axios from 'axios';
import jsPDF from 'jspdf';
import { onMounted, ref } from 'vue';

const books = ref<Book[]>([]);

const headers = ref([
  {
    key: 'id',
    title: 'Código',
    align: 'start' as const,
    sortable: false,
    width: '10%',
  },
  { key: 'title', title: 'Título', align: 'start' as const },
  { key: 'publisher', title: 'Editora', align: 'start' as const },
  { key: 'edition', title: 'Edição', align: 'start' as const },
  {
    key: 'publicationYear',
    title: 'Ano de Publicação',
    align: 'start' as const,
  },
  { key: 'actions', title: 'Ações', sortable: false, width: '10%' },
]);

const { showSnackbar } = useSnackbar();

const isEditModalVisible = ref(false);
const isConfirmDialogVisible = ref(false);
const selectedBook = ref<Book>({
  id: '',
  title: '',
  publisher: '',
  edition: 1,
  publicationYear: 2024,
  authors: [],
  subjects: [],
  price: 0,
});
const modalMode = ref<'edit' | 'create'>('edit');

async function fetchBooks() {
  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + '/books');
    books.value = response.data?.books;
  } catch (error) {
    showSnackbar('Ocorreu um erro ao buscar os livros.', 'error');
  }
}

function openNewBookModal() {
  selectedBook.value = {
    id: '',
    title: '',
    publisher: '',
    edition: 1,
    price: 0,
    publicationYear: 2024,
    authors: [],
    subjects: [],
  };

  modalMode.value = 'create';
  isEditModalVisible.value = true;
}

function editBook(item: Book) {
  selectedBook.value = { ...item };
  modalMode.value = 'edit';
  isEditModalVisible.value = true;
}

function confirmRemoveBook(item: Book) {
  selectedBook.value = { ...item };
  isConfirmDialogVisible.value = true;
}

async function handleSave(book: Book) {
  if (modalMode.value === 'edit') {
    await updateBook(book);
  } else {
    await createBook(book);
  }
}

async function updateBook(updatedBook: Book) {
  try {
    const response = await axios.put(
      import.meta.env.VITE_API_URL + `/books/${updatedBook.id}`,
      updatedBook,
    );
    const index = books.value.findIndex((book) => book.id === updatedBook.id);
    if (index !== -1) {
      books.value[index] = response.data.book;
      showSnackbar('Livro atualizado com sucesso!', 'success');
      await fetchBooks();
    }
  } catch (error) {
    showSnackbar('Ocorreu um erro ao atualizar o livro.', 'error');
  }
}

async function createBook(newBook: Book) {
  try {
    await axios.post(import.meta.env.VITE_API_URL + '/books', newBook);
    showSnackbar('Livro criado com sucesso!', 'success');
    await fetchBooks();
  } catch (error) {
    showSnackbar('Ocorreu um erro ao criar o livro.', 'error');
  }
}

async function removeBook() {
  try {
    await axios.delete(
      import.meta.env.VITE_API_URL + `/books/${selectedBook.value.id}`,
    );
    showSnackbar('Livro removido com sucesso!', 'success');
    await fetchBooks();
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      showSnackbar(error.response.data.message, 'error');
    } else {
      showSnackbar('Ocorreu um erro ao remover o livro.', 'error');
    }
  } finally {
    isConfirmDialogVisible.value = false;
  }
}

function emitReport() {
  const doc = new jsPDF();
  doc.text('Relatório de Livros', 14, 16);
  (doc as any).autoTable({
    head: [['ID', 'Nome', 'Editora', 'Edição', 'Autores', 'Assuntos']],
    body: books.value.map((book) => [
      book.id,
      book.title,
      book.publisher,
      book.edition,
      book.authors.map((author) => author.name).join(', '),
      book.subjects.map((subject) => subject.description).join(', '),
    ]),
    startY: 20,
  });
  doc.save('relatorio_livros.pdf');
  showSnackbar('Relatório emitido com sucesso!', 'success');
}

onMounted(() => {
  fetchBooks();
});
</script>

<style scoped></style>
