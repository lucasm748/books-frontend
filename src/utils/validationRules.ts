export const rules = {
  required: (value: string) => !!value || 'Campo obrigatório.',
  maxLength: (max: number) => (value: string) =>
    value.length <= max || `Máximo de ${max} caracteres.`,
  positiveNumber: (value: number) =>
    value > 0 || 'Deve ser um número maior que 0.',
};
