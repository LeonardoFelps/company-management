<script setup>
import { computed, reactive, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft,
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Pencil,
  Save,
  Search,
  Trash2,
  UserPlus,
  Users,
  X,
} from '@lucide/vue'
import {
  getCompanyById,
  addUserToCompany,
  removeUserFromCompany,
  updateUserInCompany,
} from '@/services/companyService'
import { formatCnpj, maskCnpj } from '@/utils/cnpj'

const route = useRoute()
const id = route.params.id

function normalizeSearch(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

const company = ref(null)
const loading = ref(false)
const error = ref('')
const currentUserPage = ref(1)
const usersPerPage = 5
const userSearchTerm = ref('')
const showCnpj = ref(false)

const hasUsers = computed(() => {
  return Array.isArray(company.value?.users) && company.value.users.length > 0
})

const filteredUsers = computed(() => {
  const users = company.value?.users ?? []
  const term = normalizeSearch(userSearchTerm.value)

  if (!term) {
    return users
  }

  return users.filter((user) => {
    return (
      normalizeSearch(user.name).includes(term) ||
      normalizeSearch(user.email).includes(term) ||
      normalizeSearch(user.role).includes(term)
    )
  })
})

const hasFilteredUsers = computed(() => filteredUsers.value.length > 0)

const totalUserPages = computed(() => {
  return Math.max(1, Math.ceil(filteredUsers.value.length / usersPerPage))
})

const paginatedUsers = computed(() => {
  const start = (currentUserPage.value - 1) * usersPerPage
  return filteredUsers.value.slice(start, start + usersPerPage)
})

function syncUserPage() {
  currentUserPage.value = Math.min(Math.max(currentUserPage.value, 1), totalUserPages.value)
}

function toggleCnpjVisibility() {
  showCnpj.value = !showCnpj.value
}

function getDisplayedCnpj(value) {
  return showCnpj.value ? formatCnpj(value) : maskCnpj(value)
}

function clearUserSearch() {
  userSearchTerm.value = ''
}

const showUserModal = ref(false)
const editingUserId = ref(null)

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
  editingUserId.value = null

  userError.value = ''
  userFieldErrors.name = ''
  userFieldErrors.email = ''
  userFieldErrors.role = ''
}

function openUserModal() {
  resetUserForm()
  showUserModal.value = true
}

function openEditUserModal(user) {
  userForm.name = user.name
  userForm.email = user.email
  userForm.role = user.role
  editingUserId.value = user.id
  userError.value = ''
  userFieldErrors.name = ''
  userFieldErrors.email = ''
  userFieldErrors.role = ''
  showUserModal.value = true
}

function closeUserModal() {
  showUserModal.value = false
  editingUserId.value = null
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
    if (editingUserId.value) {
      await updateUserInCompany(id, editingUserId.value, userForm)
    } else {
      await addUserToCompany(id, userForm)
      currentUserPage.value = totalUserPages.value
    }

    await loadCompany()
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

watch(userSearchTerm, () => {
  currentUserPage.value = 1
})

onMounted(() => {
  loadCompany()
})
</script>

<template>
  <main>
    <div class="toolbar">
      <div class="page-title">
        <Users class="title-icon" :size="24" />
        <div>
          <h1>Detalhes da Empresa</h1>
          <p class="subtle">Visão geral do cadastro selecionado.</p>
        </div>
      </div>

      <RouterLink class="secondary-link" to="/empresas">
        <ArrowLeft :size="16" />
        Voltar para a lista
      </RouterLink>
    </div>

    <p v-if="loading" class="subtle">Carregando detalhes da empresa...</p>
    <p v-else-if="error" class="notice-error">{{ error }}</p>

    <section v-else-if="company" class="company-layout">
      <article class="details-card company-summary">
        <p class="section-label">Empresa</p>
        <div class="summary-badge">
          <Building2 :size="16" />
          Cadastro principal
        </div>
        <h2>{{ company.name }}</h2>

        <div class="meta-list">
          <div>
            <span class="meta-label">CNPJ</span>
            <div class="inline-meta">
              <p>{{ getDisplayedCnpj(company.cnpj) }}</p>
              <button
                type="button"
                class="icon-button"
                :aria-label="showCnpj ? 'Ocultar CNPJ' : 'Exibir CNPJ'"
                :title="showCnpj ? 'Ocultar CNPJ' : 'Exibir CNPJ'"
                @click="toggleCnpjVisibility"
              >
                <EyeOff v-if="showCnpj" :size="16" />
                <Eye v-else :size="16" />
              </button>
            </div>
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

          <button type="button" class="primary-button" @click="openUserModal">
            <UserPlus :size="16" />
            Adicionar usuário
          </button>
        </div>

        <div class="filter-bar filter-bar--compact">
          <div class="field filter-field">
            <label for="user-search">Buscar usuário</label>
            <div class="search-input-wrap">
              <Search class="search-icon" :size="16" />
              <input
                id="user-search"
                v-model="userSearchTerm"
                type="search"
                placeholder="Nome, e-mail ou cargo"
              />
              <button
                v-if="userSearchTerm"
                type="button"
                class="icon-button"
                aria-label="Limpar filtro"
                @click="clearUserSearch"
              >
                <X :size="16" />
              </button>
            </div>
          </div>

          <p class="subtle filter-meta">
            {{ filteredUsers.length }} usuário{{ filteredUsers.length === 1 ? '' : 's' }}
          </p>
        </div>

        <div v-if="hasUsers && hasFilteredUsers" class="table-wrap">
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
                  <div class="actions user-actions">
                    <button
                      type="button"
                      class="edit-button small-button"
                      @click="openEditUserModal(user)"
                    >
                      <Pencil :size="16" />
                      Editar
                    </button>

                    <button
                      type="button"
                      class="danger-button small-button"
                      @click="handleRemoveUser(user.id)"
                    >
                      <Trash2 :size="16" />
                      Remover
                    </button>
                  </div>
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
              <ChevronLeft :size="16" />
              Anterior
            </button>

            <p class="subtle">Página {{ currentUserPage }} de {{ totalUserPages }}</p>

            <button
              type="button"
              class="ghost-button"
              :disabled="currentUserPage === totalUserPages"
              @click="currentUserPage++"
            >
              Próxima
              <ChevronRight :size="16" />
            </button>
          </div>
        </div>

        <p v-else-if="hasUsers" class="subtle">Nenhum usuário corresponde ao filtro aplicado.</p>
        <p v-else class="subtle">Nenhum usuário vinculado a esta empresa.</p>
      </article>
    </section>

    <div v-if="showUserModal" class="modal-backdrop">
      <div class="modal-card">
        <button
          type="button"
          class="modal-close-button"
          aria-label="Fechar modal"
          title="Fechar"
          @click="closeUserModal"
        >
          <X :size="18" />
        </button>

        <div class="section-header">
          <div>
            <p class="section-label">Usuário</p>
            <h3>{{ editingUserId ? 'Editar usuário' : 'Adicionar usuário' }}</h3>
          </div>
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
            <button type="submit" class="primary-button" :disabled="userSaving">
              <Save v-if="!userSaving" :size="16" />
              {{ userSaving ? 'Salvando...' : editingUserId ? 'Atualizar usuário' : 'Salvar usuário' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
