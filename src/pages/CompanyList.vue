<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { deleteCompany, listCompanies } from '@/services/companyService'

const companies = ref([])
const loading = ref(false)
const error = ref('')
const searchTerm = ref('')
const currentPage = ref(1)
const perPage = 5
const totalPages = ref(1)
const totalItems = ref(0)

const hasCompanies = computed(() => companies.value.length > 0)

async function loadCompanies(page = currentPage.value, search = searchTerm.value) {
  loading.value = true
  error.value = ''

  try {
    const response = await listCompanies(page, perPage, search)
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
  const confirmed = window.confirm('Tem certeza que deseja excluir esta empresa?')

  if (!confirmed) {
    return
  }

  await deleteCompany(id)
  await loadCompanies(currentPage.value)
}

watch(searchTerm, () => {
  loadCompanies(1)
})

onMounted(() => {
  loadCompanies()
})
</script>

<template>
  <main>
    <div class="toolbar">
      <div>
        <h1>Empresas</h1>
        <p class="subtle">Gerencie cadastros, status e navegação entre telas.</p>
      </div>

      <RouterLink class="secondary-link" to="/empresas/nova">Cadastrar empresa</RouterLink>
    </div>

    <section class="filter-bar">
      <div class="field filter-field">
        <label for="company-search">Buscar empresa</label>
        <input
          id="company-search"
          v-model="searchTerm"
          type="search"
          placeholder="Nome, CNPJ ou status"
        />
      </div>

      <p class="subtle filter-meta">
        {{ totalItems }} resultado{{ totalItems === 1 ? '' : 's' }}
      </p>
    </section>

    <p v-if="loading" class="subtle">Carregando empresas...</p>
    <p v-else-if="error" class="notice-error">{{ error }}</p>

    <section v-else-if="hasCompanies" class="card-grid">
      <article v-for="company in companies" :key="company.id">
        <div class="meta">
          <h2>{{ company.name }}</h2>
          <p>CNPJ: {{ company.cnpj }}</p>
          <span
            class="status-pill"
            :class="company.status === 1 ? 'status-active' : 'status-inactive'"
          >
            {{ company.status === 1 ? 'Ativa' : 'Inativa' }}
          </span>
        </div>

        <div class="actions card-actions">
          <RouterLink class="secondary-link" :to="`/empresas/${company.id}`">Visualizar</RouterLink>
          <RouterLink class="secondary-link" :to="`/empresas/${company.id}/editar`">Editar</RouterLink>
          <button class="danger-button" type="button" @click="handleDelete(company.id)">
            Excluir
          </button>
        </div>
      </article>

      <div v-if="totalPages > 1" class="pagination">
        <button type="button" @click="prevPage" :disabled="currentPage === 1">
          Anterior
        </button>

        <span class="subtle">Página {{ currentPage }} de {{ totalPages }}</span>

        <button type="button" @click="nextPage" :disabled="currentPage === totalPages">
          Próxima
        </button>
      </div>
    </section>

    <section v-else class="empty-state">
      <h2>Nenhuma empresa encontrada</h2>
      <p class="subtle">Tente ajustar o filtro ou cadastrar uma nova empresa.</p>
    </section>
  </main>
</template>
