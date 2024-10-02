<template>
  <v-dialog
    :model-value="isVisible"
    @update:model-value="updateVisibility"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{
          mode === 'edit' ? 'Editar Assunto' : 'Novo Assunto'
        }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="subject.description"
            label="Descrição"
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
  subject: { id: string; description: string };
  mode: 'edit' | 'create';
}>();
const emit = defineEmits(['update:isVisible', 'save']);

const subject = ref({ ...props.subject });

watch(
  () => props.subject,
  (newSubject) => {
    subject.value = { ...newSubject };
  },
);

function updateVisibility(value: boolean) {
  emit('update:isVisible', value);
}

function close() {
  emit('update:isVisible', false);
}

function save() {
  emit('save', subject.value);
  close();
}
</script>

<style scoped></style>
