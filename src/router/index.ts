import Report from '@/components/Report.vue';
import Authors from '@/views/Authors.vue';
import Books from '@/views/Books.vue';
import Subjects from '@/views/Subjects.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/assuntos', component: Subjects },
  { path: '/autores', component: Authors },
  { path: '/livros', component: Books },
  { path: '/relatorio', component: Report },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
