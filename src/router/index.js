import { createRouter, createWebHistory } from 'vue-router'
import CompanyList from '@/pages/CompanyList.vue'
import CompanyDetails from '@/pages/CompanyDetails.vue'

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
    {
      path: '/empresas/:id',
      name: 'company-details',
      component: CompanyDetails,
    },
  ],
})

export default router
