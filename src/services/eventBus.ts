import { ref } from 'vue';

const snackbarVisible = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('error');

export function useSnackbar() {
  function showSnackbar(message: string, type: 'success' | 'error' = 'error') {
    snackbarMessage.value = message;
    snackbarVisible.value = true;
    snackbarColor.value = type === 'success' ? 'green' : 'error';

    setTimeout(() => {
      snackbarVisible.value = false;
    }, 2000);
  }

  return {
    snackbarVisible,
    snackbarMessage,
    snackbarColor,
    showSnackbar,
  };
}
