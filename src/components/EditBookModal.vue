<template>
  <v-dialog :model-value="isVisible" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ mode === 'edit' ? 'Editar Livro' : 'Novo Livro' }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field v-model="book.id" label="Código" :disabled="mode === 'edit'" required></v-text-field>
          <v-text-field v-model="book.title" label="Título" required></v-text-field>
          <v-text-field v-model="book.publisher" label="Editora" required></v-text-field>
          <v-text-field v-model="book.edition" label="Edição" type="number" required></v-text-field>
          <v-text-field v-model="book.publicationyear" label="Ano de Publicação" type="number" required></v-text-field>
          <v-autocomplete v-model="book.authors" :items="authors" label="Autores" multiple chips></v-autocomplete>
          <v-autocomplete v-model="book.subjects" :items="subjects" label="Assuntos" multiple chips></v-autocomplete>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" variant="text" @click="close">Cancelar</v-btn>
        <v-btn color="blue darken-1" variant="text" @click="save">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue';

interface Book {
  id: string;
  title: string;
  publisher: string;
  edition: number;
  publicationyear: number;
  authors: string[];
  subjects: string[];
}

const props = defineProps<{
  isVisible: boolean;
  book: Book;
  mode: 'edit' | 'create';
}>();

const emit = defineEmits(['update:isVisible', 'save']);

const book = ref<Book>({ ...props.book });
const authors = ref<string[]>([]);
const subjects = ref<string[]>([]);

watch(() => props.book, (newBook) => {
  book.value = { ...newBook };
});

function close() {
  emit('update:isVisible', false);
}

function save() {
  emit('save', book.value);
  close();
}
</script>

<style scoped></style>
