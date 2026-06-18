<script setup>
import { computed, ref, onMounted } from 'vue'
import { getCompanyById } from '@/services/companyService'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id

const company = ref(null)
const loading = ref(false)
const error = ref('')

const hasUsers = computed(() => {
  return Array.isArray(company.value?.users) && company.value.users.length > 0
})

async function loadCompany() {
  loading.value = true
  error.value = ''

  try {
    company.value = await getCompanyById(id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar empresa'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCompany()
})
</script>

<template>
  <main>
    <div class="toolbar">
      <div>
        <h1>Detalhes da Empresa</h1>
        <p class="subtle">Visão geral do cadastro selecionado.</p>
      </div>

      <RouterLink class="secondary-link" to="/empresas">Voltar para a lista</RouterLink>
    </div>

    <p v-if="loading" class="subtle">Carregando detalhes da empresa...</p>
    <p v-else-if="error" class="notice-error">{{ error }}</p>

    <section v-else-if="company" class="company-layout">
      <article class="details-card company-summary">
        <p class="section-label">Empresa</p>
        <h2>{{ company.name }}</h2>

        <div class="meta-list">
          <div>
            <span class="meta-label">CNPJ</span>
            <p>{{ company.cnpj }}</p>
          </div>

          <div>
            <span class="meta-label">Status</span>
            <span
              class="status-pill"
              :class="company.status === 1 ? 'status-active' : 'status-inactive'"
            >
              {{ company.status === 1 ? 'Ativa' : 'Inativa' }}
            </span>
          </div>
        </div>
      </article>

      <article class="details-card">
        <div class="section-header">
          <div>
            <p class="section-label">Usuários</p>
            <h3>Usuários vinculados</h3>
          </div>

          <button type="button">Adicionar usuário</button>
        </div>

        <div v-if="hasUsers" class="table-wrap">
          <table class="users-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Cargo</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="user in company.users" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>
                  <button type="button" class="danger-button small-button">Remover</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-else class="subtle">Nenhum usuário vinculado a esta empresa.</p>
      </article>
    </section>
  </main>
</template>

<style scoped>
.company-layout {
  display: grid;
  grid-template-columns: minmax(280px, 360px) 1fr;
  gap: 20px;
  align-items: start;
}

.details-card {
  display: grid;
  gap: 16px;
  padding: 20px;
}

.company-summary {
  position: sticky;
  top: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.section-label {
  margin: 0 0 6px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.meta-list {
  display: grid;
  gap: 14px;
}

.meta-label {
  display: block;
  margin-bottom: 4px;
  font-size: 0.86rem;
  color: var(--muted);
}

.table-wrap {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 12px 10px;
  border-bottom: 1px solid var(--border);
  text-align: left;
  vertical-align: middle;
}

.users-table th {
  font-size: 0.86rem;
  color: var(--muted);
  font-weight: 700;
}

.users-table tbody tr:hover {
  background: var(--surface-soft);
}

.small-button {
  padding: 0.6rem 0.85rem;
}

@media (max-width: 900px) {
  .company-layout {
    grid-template-columns: 1fr;
  }

  .company-summary {
    position: static;
  }

  .section-header {
    flex-direction: column;
  }
}
</style>
