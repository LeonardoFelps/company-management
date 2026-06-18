<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from '@lucide/vue'
import { deleteCompany, listCompanies } from '@/services/companyService'
import { formatCnpj, maskCnpj } from '@/utils/cnpj'

const companies = ref([])
const loading = ref(false)
const error = ref('')
const searchTerm = ref('')
const visibleCnpjById = ref({})
const currentPage = ref(1)
const perPage = 5
const totalPages = ref(1)
const totalItems = ref(0)

const hasCompanies = computed(() => companies.value.length > 0)

function clearSearch() {
  searchTerm.value = ''
}

function toggleCnpjVisibility(companyId) {
  visibleCnpjById.value = {
    ...visibleCnpjById.value,
    [companyId]: !visibleCnpjById.value[companyId],
  }
}

function isCnpjVisible(companyId) {
  return Boolean(visibleCnpjById.value[companyId])
}

function getDisplayedCnpj(value, companyId) {
  return isCnpjVisible(companyId) ? formatCnpj(value) : maskCnpj(value)
}

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
      <div class="page-title">
        <Building2 class="title-icon" :size="24" />
        <div>
          <h1>Empresas</h1>
          <p class="subtle">Gerencie cadastros, status e navegação entre telas.</p>
        </div>
      </div>

      <RouterLink class="secondary-link primary-button" to="/empresas/nova">
        <Plus :size="16" />
        Cadastrar empresa
      </RouterLink>
    </div>

    <section class="filter-bar">
      <div class="field filter-field">
        <label for="company-search">Buscar empresa</label>
        <div class="search-input-wrap">
          <Search class="search-icon" :size="16" />
          <input
            id="company-search"
            v-model="searchTerm"
            type="search"
            placeholder="Nome, CNPJ ou status"
          />
          <button
            v-if="searchTerm"
            type="button"
            class="icon-button"
            aria-label="Limpar filtro"
            @click="clearSearch"
          >
            <X :size="16" />
          </button>
        </div>
      </div>

      <p class="subtle filter-meta">
        {{ totalItems }} resultado{{ totalItems === 1 ? '' : 's' }}
      </p>
    </section>

    <p v-if="loading" class="subtle">Carregando empresas...</p>
    <p v-else-if="error" class="notice-error">{{ error }}</p>

    <section v-else-if="hasCompanies" class="card-grid">
      <article v-for="company in companies" :key="company.id" class="company-card">
        <div class="meta">
          <div class="company-card-top">
            <div class="company-card-icon">
              <Building2 :size="18" />
            </div>
            <h2>{{ company.name }}</h2>
          </div>
          <div class="inline-meta">
            <p>CNPJ: {{ getDisplayedCnpj(company.cnpj, company.id) }}</p>
            <button
              type="button"
              class="icon-button"
              :aria-label="isCnpjVisible(company.id) ? 'Ocultar CNPJ' : 'Exibir CNPJ'"
              :title="isCnpjVisible(company.id) ? 'Ocultar CNPJ' : 'Exibir CNPJ'"
              @click="toggleCnpjVisibility(company.id)"
            >
              <EyeOff v-if="isCnpjVisible(company.id)" :size="16" />
              <Eye v-else :size="16" />
            </button>
          </div>
          <span
            class="status-pill"
            :class="company.status === 1 ? 'status-active' : 'status-inactive'"
          >
            {{ company.status === 1 ? 'Ativa' : 'Inativa' }}
          </span>
          <p class="company-card-summary">
            {{ company.users?.length ?? 0 }} usuário{{ (company.users?.length ?? 0) === 1 ? '' : 's' }}
            vinculado{{ (company.users?.length ?? 0) === 1 ? '' : 's' }}
          </p>
        </div>

        <div class="card-divider"></div>

        <div class="actions card-actions">
          <RouterLink class="secondary-link view-button" :to="`/empresas/${company.id}`">
            <Eye :size="16" />
            Visualizar
          </RouterLink>
          <RouterLink class="secondary-link edit-button" :to="`/empresas/${company.id}/editar`">
            <Pencil :size="16" />
            Editar
          </RouterLink>
          <button class="danger-button" type="button" @click="handleDelete(company.id)">
            <Trash2 :size="16" />
            Excluir
          </button>
        </div>
      </article>

      <div v-if="totalPages > 1" class="pagination">
        <button type="button" @click="prevPage" :disabled="currentPage === 1">
          <ChevronLeft :size="16" />
          Anterior
        </button>

        <span class="subtle">Página {{ currentPage }} de {{ totalPages }}</span>

        <button type="button" @click="nextPage" :disabled="currentPage === totalPages">
          Próxima
          <ChevronRight :size="16" />
        </button>
      </div>
    </section>

    <section v-else class="empty-state">
      <Building2 class="empty-icon" :size="28" />
      <h2>Nenhuma empresa encontrada</h2>
      <p class="subtle">Tente ajustar o filtro ou cadastrar uma nova empresa.</p>
    </section>
  </main>
</template>
