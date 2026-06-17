import { createRouter, createWebHistory } from 'vue-router'
import CompanyList from '@/pages/CompanyList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/empresas',
    },
    {
      path: '/empresas',
      name: 'companies',
      component: CompanyList,
    },
  ],
})

export default router
