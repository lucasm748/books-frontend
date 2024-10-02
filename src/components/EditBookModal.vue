<template>
  <v-dialog
    :model-value="isVisible"
    @update:model-value="updateVisibility"
    max-width="500px"
    @click:outside="close"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{
          mode === 'edit' ? 'Editar Livro' : 'Novo Livro'
        }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="isFormValid">
          <v-text-field
            v-if="mode === 'edit'"
            v-model="bookLocal.id"
            label="Código"
            :disabled="mode === 'edit'"
            required
          ></v-text-field>
          <v-text-field
            v-model="bookLocal.title"
            label="Título"
            :rules="[rules.required, rules.maxLength(40)]"
            required
          ></v-text-field>
          <v-text-field
            v-model="bookLocal.publisher"
            label="Editora"
            :rules="[rules.required, rules.maxLength(40)]"
            required
          ></v-text-field>
          <v-text-field
            v-model="bookLocal.edition"
            label="Edição"
            type="number"
            :rules="[rules.required, rules.positiveNumber]"
            required
          ></v-text-field>
          <v-text-field
            v-model="bookLocal.publicationYear"
            label="Ano de Publicação"
            type="number"
            :rules="[rules.required, rules.positiveNumber]"
            required
          ></v-text-field>
          <v-text-field
            v-model="bookLocal.price"
            label="Preço"
            type="number"
            :rules="[rules.required, rules.positiveNumber]"
            required
          ></v-text-field>
          <!-- Ajuste o autocomplete para lidar com objetos, não strings -->
          <v-autocomplete
            v-model="selectedAuthors"
            :items="authors"
            :item-title="(item) => item.name"
            :item-value="(item) => item.id"
            label="Autores"
            multiple
            chips
          ></v-autocomplete>
          <v-autocomplete
            v-model="selectedSubjects"
            :items="subjects"
            :item-title="(item) => item.description"
            :item-value="(item) => item.id"
            item-text="description"
            label="Assuntos"
            multiple
            chips
          ></v-autocomplete>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" variant="text" @click="close"
          >Cancelar</v-btn
        >
        <v-btn
          color="blue darken-1"
          :disabled="!isFormValid"
          @click="save"
          variant="text"
          >{{ mode === 'edit' ? 'Salvar' : 'Criar' }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useSnackbar } from '@/services/eventBus';
import { Author } from '@/types/Author';
import { Book } from '@/types/Book';
import { Subject } from '@/types/Subject';
import { rules } from '@/utils/validationRules';
import axios from 'axios';
import { defineEmits, defineProps, onMounted, ref, watch } from 'vue';

const { showSnackbar } = useSnackbar();

const props = defineProps<{
  isVisible: boolean;
  book: Book;
  mode: 'edit' | 'create';
}>();

const emit = defineEmits(['update:isVisible', 'save']);

const bookLocal = ref<Book>({ ...props.book });
const isFormValid = ref(false);
const formRef = ref();
const authors = ref<Author[]>([]);
const subjects = ref<Subject[]>([]);

const selectedAuthors = ref<string[]>([]);
const selectedSubjects = ref<string[]>([]);

watch(
  () => props.book,
  (newBook) => {
    bookLocal.value = { ...newBook };

    selectedAuthors.value = newBook.authors.map((author) => author.id);
    selectedSubjects.value = newBook.subjects.map((subject) => subject.id);
  },
  { immediate: true },
);

function updateVisibility(value: boolean) {
  emit('update:isVisible', value);
}

function close() {
  emit('update:isVisible', false);
}

async function save() {
  if (formRef.value) {
    const isValid = await formRef.value.validate();
    if (isValid) {
      const { subjects, authors, ...data } = bookLocal.value;

      const payload = {
        ...data,
        authors: selectedAuthors.value.filter(
          (author) => author !== null && author !== undefined,
        ),
        subjects: selectedSubjects.value.filter(
          (subject) => subject !== null && subject !== undefined,
        ),
      };

      emit('save', payload);
      emit('update:isVisible', false);
      close();
    }
  }
}

onMounted(async () => {
  await fetchAuthors();
  await fetchSubjects();
});

async function fetchAuthors() {
  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + '/authors');
    authors.value = response.data?.authors.map((author: Author) => author);
  } catch (error) {
    showSnackbar('Erro ao carregar autores', 'error');
  }
}

async function fetchSubjects() {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + '/subjects',
    );
    subjects.value = response.data?.subjects.map((subject: Subject) => subject);
  } catch (error) {
    showSnackbar('Erro ao carregar assuntos', 'error');
  }
}
</script>

<style scoped></style>
