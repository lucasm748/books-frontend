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
          mode === 'edit' ? 'Editar Assunto' : 'Novo Assunto'
        }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="isFormValid">
          <v-text-field
            v-model="subjectLocal.description"
            label="Descrição"
            :rules="[rules.required, rules.maxLength(40)]"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" variant="text" @click="close"
          >Cancelar</v-btn
        >
        <v-btn
          color="blue darken-1"
          variant="text"
          :disabled="!isFormValid"
          @click="save"
        >
          {{ mode === 'edit' ? 'Salvar' : 'Criar' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { rules } from '@/utils/validationRules';
import { defineEmits, defineProps, ref, watch } from 'vue';

const props = defineProps<{
  isVisible: boolean;
  subject: { id: string; description: string };
  mode: 'edit' | 'create';
}>();

const emit = defineEmits(['update:isVisible', 'save']);

const subjectLocal = ref({ ...props.subject });
const isFormValid = ref(false);
const formRef = ref();

watch(
  () => props.subject,
  (newSubject) => {
    subjectLocal.value = { ...newSubject };
  },
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
      emit('save', subjectLocal.value);
      emit('update:isVisible', false);
    }
  }
}
</script>

<style scoped></style>
