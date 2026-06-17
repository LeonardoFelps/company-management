<script setup>
import { onMounted, ref } from 'vue'
import { deleteCompany, listCompanies } from '@/services/companyService'

const companies = ref([])
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const perPage = 5
const totalPages = ref(1)
const totalItems = ref(0)

async function loadCompanies(page = currentPage.value) {
  loading.value = true
  error.value = ''

  try {
    const response = await listCompanies(page, perPage)
    companies.value = response.items
    currentPage.value = response.page
    totalPages.value = response.totalPages
    totalItems.value = response.total
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar empresas'
  } finally {
    loading.value = false
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    loadCompanies(currentPage.value + 1)
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    loadCompanies(currentPage.value - 1)
  }
}

async function handleDelete(id) {
  await deleteCompany(id)
  await loadCompanies(currentPage.value)
}

onMounted(() => {
  loadCompanies()
})
</script>

<template>
  <main>
    <h1>Empresas</h1>

    <p>
      <RouterLink to="/empresas/nova">Cadastrar empresa</RouterLink>
    </p>

    <p v-if="loading">Carregando empresas...</p>
    <p v-else-if="error">{{ error }}</p>

    <section v-else>
      <article v-for="company in companies" :key="company.id">
        <h2>{{ company.name }}</h2>
        <p>CNPJ: {{ company.cnpj }}</p>
        <p>Status: {{ company.status === 1 ? 'Ativa' : 'Inativa' }}</p>

        <div>
          <RouterLink :to="`/empresas/${company.id}`">Visualizar</RouterLink>
          <RouterLink :to="`/empresas/${company.id}/editar`">Editar</RouterLink>
          <button type="button" @click="handleDelete(company.id)">Excluir</button>
        </div>
      </article>

      <div v-if="totalItems > perPage">
        <button type="button" @click="prevPage" :disabled="currentPage === 1">
          Anterior
        </button>

        <span>Pagina {{ currentPage }} de {{ totalPages }}</span>

        <button type="button" @click="nextPage" :disabled="currentPage === totalPages">
          Próxima
        </button>
      </div>
    </section>
  </main>
</template>
