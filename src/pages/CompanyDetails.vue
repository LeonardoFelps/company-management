<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCompanyById, addUserToCompany, removeUserFromCompany } from '@/services/companyService'

const route = useRoute()
const id = route.params.id

const company = ref(null)
const loading = ref(false)
const error = ref('')
const currentUserPage = ref(1)
const usersPerPage = 5

const hasUsers = computed(() => {
  return Array.isArray(company.value?.users) && company.value.users.length > 0
})

const totalUserPages = computed(() => {
  const totalUsers = company.value?.users?.length ?? 0

  return Math.max(1, Math.ceil(totalUsers / usersPerPage))
})

const paginatedUsers = computed(() => {
  const users = company.value?.users ?? []
  const start = (currentUserPage.value - 1) * usersPerPage

  return users.slice(start, start + usersPerPage)
})

function syncUserPage() {
  currentUserPage.value = Math.min(Math.max(currentUserPage.value, 1), totalUserPages.value)
}

const showUserModal = ref(false)

const userForm = reactive({
  name: '',
  email: '',
  role: '',
})

const userError = ref('')
const userSaving = ref(false)
const userFieldErrors = reactive({
  name: '',
  email: '',
  role: '',
})

function resetUserForm() {
  userForm.name = ''
  userForm.email = ''
  userForm.role = ''

  userError.value = ''
  userFieldErrors.name = ''
  userFieldErrors.email = ''
  userFieldErrors.role = ''
}

function openUserModal() {
  resetUserForm()
  showUserModal.value = true
}

function closeUserModal() {
  showUserModal.value = false
}

function validateUserForm() {
  userFieldErrors.name = ''
  userFieldErrors.email = ''
  userFieldErrors.role = ''

  let valid = true

  if (!userForm.name.trim()) {
    userFieldErrors.name = 'Nome é obrigatório'
    valid = false
  }

  if (!userForm.email.trim()) {
    userFieldErrors.email = 'E-mail é obrigatório'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
    userFieldErrors.email = 'E-mail inválido'
    valid = false
  }

  if (!userForm.role.trim()) {
    userFieldErrors.role = 'Cargo é obrigatório'
    valid = false
  }

  return valid
}

async function handleAddUser() {
  userError.value = ''

  if (!validateUserForm()) {
    return
  }

  userSaving.value = true

  try {
    await addUserToCompany(id, userForm)
    await loadCompany()
    currentUserPage.value = totalUserPages.value
    closeUserModal()
  } catch (err) {
    userError.value = err instanceof Error ? err.message : 'Erro ao salvar usuário'
  } finally {
    userSaving.value = false
  }
}

async function handleRemoveUser(userId) {
  const confirmed = window.confirm('Tem certeza que deseja remover este usuário?')

  if (!confirmed) {
    return
  }

  try {
    await removeUserFromCompany(id, userId)
    await loadCompany()
    syncUserPage()
  } catch (err) {
    userError.value = err instanceof Error ? err.message : 'Erro ao remover usuário'
  }
}

async function loadCompany() {
  loading.value = true
  error.value = ''

  try {
    company.value = await getCompanyById(id)
    syncUserPage()
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

          <button type="button" @click="openUserModal">Adicionar usuário</button>
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
              <tr v-for="user in paginatedUsers" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>
                  <button
                    type="button"
                    class="danger-button small-button"
                    @click="handleRemoveUser(user.id)"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="totalUserPages > 1" class="pagination">
            <button
              type="button"
              class="ghost-button"
              :disabled="currentUserPage === 1"
              @click="currentUserPage--"
            >
              Anterior
            </button>

            <p class="subtle">
              Página {{ currentUserPage }} de {{ totalUserPages }}
            </p>

            <button
              type="button"
              class="ghost-button"
              :disabled="currentUserPage === totalUserPages"
              @click="currentUserPage++"
            >
              Próxima
            </button>
          </div>
        </div>

        <p v-else class="subtle">Nenhum usuário vinculado a esta empresa.</p>
      </article>
    </section>

    <div v-if="showUserModal" class="modal-backdrop">
      <div class="modal-card">
        <div class="section-header">
          <div>
            <p class="section-label">Novo usuário</p>
            <h3>Adicionar usuário</h3>
          </div>

          <button type="button" class="ghost-button" @click="closeUserModal">Fechar</button>
        </div>

        <p v-if="userError" class="notice-error">{{ userError }}</p>

        <form class="stack" @submit.prevent="handleAddUser">
          <div class="field">
            <label for="user-name">Nome</label>
            <input id="user-name" v-model="userForm.name" type="text" />
            <p v-if="userFieldErrors.name" class="field-error">{{ userFieldErrors.name }}</p>
          </div>

          <div class="field">
            <label for="user-email">E-mail</label>
            <input id="user-email" v-model="userForm.email" type="email" />
            <p v-if="userFieldErrors.email" class="field-error">{{ userFieldErrors.email }}</p>
          </div>

          <div class="field">
            <label for="user-role">Cargo</label>
            <input id="user-role" v-model="userForm.role" type="text" />
            <p v-if="userFieldErrors.role" class="field-error">{{ userFieldErrors.role }}</p>
          </div>

          <div class="actions">
            <button type="button" class="ghost-button" @click="closeUserModal">Cancelar</button>
            <button type="submit" :disabled="userSaving">
              {{ userSaving ? 'Salvando...' : 'Salvar usuário' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
