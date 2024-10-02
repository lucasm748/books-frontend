<template>
  <v-dialog
    :model-value="isVisible"
    @update:model-value="updateVisibility"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{
          mode === 'edit' ? 'Editar Autor' : 'Novo Autor'
        }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="author.name"
            label="Nome"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" variant="text" @click="close"
          >Cancelar</v-btn
        >
        <v-btn color="blue darken-1" variant="text" @click="save">{{
          mode === 'edit' ? 'Salvar' : 'Criar'
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps<{
  isVisible: boolean;
  author: { id: string; name: string };
  mode: 'edit' | 'create';
}>();
const emit = defineEmits(['update:isVisible', 'save']);

const author = ref({ ...props.author });

watch(
  () => props.author,
  (newAuthor) => {
    author.value = { ...newAuthor };
  },
);

function updateVisibility(value: boolean) {
  emit('update:isVisible', value);
}

function close() {
  emit('update:isVisible', false);
}

function save() {
  emit('save', author.value);
  close();
}
</script>

<style scoped></style>
