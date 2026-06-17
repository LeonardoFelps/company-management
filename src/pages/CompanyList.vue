<script setup>
import { ref, onMounted } from 'vue'
import { listCompanies, deleteCompany } from '@/services/companyService'

const companies = ref([])
const loading = ref(false)
const error = ref('')

async function loadCompanies() {
  loading.value = true
  error.value = ''

  try {
    companies.value = await listCompanies()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar empresas'
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  await deleteCompany(id)
  await loadCompanies()
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
      </section>
  </main>
</template>
