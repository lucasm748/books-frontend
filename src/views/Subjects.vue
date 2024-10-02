<template>
  <v-container>
    <DefaultDataTable
      :headers="headers"
      :items="subjects"
      @edit="editSubject"
      @remove="confirmRemoveSubject"
      :card-title="'Assuntos Cadastrados'"
    />
    <v-btn class="mt-4" color="blue" dark @click="openNewSubjectModal"
      >Novo Assunto</v-btn
    >
    <v-btn class="mt-4 ml-2" color="green" dark @click="emitReport"
      >Emitir Relatório</v-btn
    >
    <EditSubjectModal
      :isVisible="isEditModalVisible"
      :subject="selectedSubject"
      :mode="modalMode"
      @update:isVisible="isEditModalVisible = $event"
      @save="handleSave"
    />
    <v-dialog v-model="isConfirmDialogVisible" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Exclusão</v-card-title>
        <v-card-text
          >Tem certeza de que deseja excluir este assunto?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            variant="text"
            @click="isConfirmDialogVisible = false"
            >Cancelar</v-btn
          >
          <v-btn color="red darken-1" variant="text" @click="removeSubject"
            >Excluir</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import DefaultDataTable from '@/components/DefaultDataTable.vue';
import EditSubjectModal from '@/components/EditSubjectModal.vue';
import { useSnackbar } from '@/services/eventBus';
import axios from 'axios';
import jsPDF from 'jspdf';
import { onMounted, ref } from 'vue';

interface Subject {
  id: string;
  description: string;
}

const subjects = ref<Subject[]>([]);

const headers = ref([
  {
    key: 'id',
    title: 'ID',
    align: 'start' as const,
    sortable: false,
    width: '20%',
  },
  { key: 'description', title: 'Descrição', align: 'start' as const },
  { key: 'actions', title: 'Ações', sortable: false, width: '10%' },
]);

const { showSnackbar } = useSnackbar();

const isEditModalVisible = ref(false);
const isConfirmDialogVisible = ref(false);
const selectedSubject = ref<Subject>({ id: '', description: '' });
const modalMode = ref<'edit' | 'create'>('edit');

async function fetchSubjects() {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + '/subjects',
    );
    subjects.value = response.data?.subjects;
  } catch (error) {
    showSnackbar('Ocorreu um erro ao buscar os assuntos.', 'error');
  }
}

function openNewSubjectModal() {
  selectedSubject.value = { id: '', description: '' };
  modalMode.value = 'create';
  isEditModalVisible.value = true;
}

function editSubject(item: Subject) {
  selectedSubject.value = { ...item };
  modalMode.value = 'edit';
  isEditModalVisible.value = true;
}

function confirmRemoveSubject(item: Subject) {
  selectedSubject.value = { ...item };
  isConfirmDialogVisible.value = true;
}

async function handleSave(subject: Subject) {
  if (modalMode.value === 'edit') {
    await updateSubject(subject);
  } else {
    await createSubject(subject);
  }
}

async function updateSubject(updatedSubject: Subject) {
  try {
    const response = await axios.put(
      import.meta.env.VITE_API_URL + `/subjects/${updatedSubject.id}`,
      updatedSubject,
    );
    const index = subjects.value.findIndex(
      (subject) => subject.id === updatedSubject.id,
    );
    if (index !== -1) {
      subjects.value[index] = response.data.subject;
      showSnackbar('Assunto atualizado com sucesso!', 'success');
      await fetchSubjects();
    }
  } catch (error) {
    showSnackbar('Ocorreu um erro ao atualizar o assunto.', 'error');
  }
}

async function createSubject(newSubject: Subject) {
  try {
    await axios.post(import.meta.env.VITE_API_URL + '/subjects', newSubject);
    showSnackbar('Assunto criado com sucesso!', 'success');
    await fetchSubjects();
  } catch (error) {
    showSnackbar('Ocorreu um erro ao criar o assunto.', 'error');
  }
}

async function removeSubject() {
  try {
    await axios.delete(
      import.meta.env.VITE_API_URL + `/subjects/${selectedSubject.value.id}`,
    );
    showSnackbar('Assunto removido com sucesso!', 'success');
    await fetchSubjects();
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      showSnackbar(error.response.data.message, 'error');
    } else {
      showSnackbar('Ocorreu um erro ao remover o assunto.', 'error');
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
    body: subjects.value.map((subject) => [subject.id, subject.description]),
    startY: 20,
  });
  doc.save('relatorio_autores.pdf');
  showSnackbar('Relatório emitido com sucesso!', 'success');
}

onMounted(() => {
  fetchSubjects();
});
</script>

<style scoped></style>
