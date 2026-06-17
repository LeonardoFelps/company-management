import { createRouter, createWebHistory } from 'vue-router'
import CompanyList from '@/pages/CompanyList.vue'
import CompanyDetails from '@/pages/CompanyDetails.vue'
import CompanyEdit from '@/pages/CompanyEdit.vue'
import CompanyNew from '@/pages/CompanyNew.vue'

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
    {
      path: '/empresas/:id/editar',
      name: 'company-edit',
      component: CompanyEdit,
    },
    {
      path: '/empresas/nova',
      name: 'company-new',
      component: CompanyNew,
    },
  ],
})

export default router
