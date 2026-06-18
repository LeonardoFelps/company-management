<script setup>
import { reactive, ref } from 'vue'
import { createCompany } from '@/services/companyService'
import { isValidCnpj } from '@/utils/cnpj'

const form = reactive({
  name: '',
  cnpj: '',
  status: 1,
})

const saving = ref(false)
const error = ref('')
const success = ref('')
const fieldErrors = reactive({
  name: '',
  cnpj: '',
})

function validateForm() {
  fieldErrors.name = ''
  fieldErrors.cnpj = ''

  let valid = true

  if (!form.name.trim()) {
    fieldErrors.name = 'Nome da empresa é obrigatório'
    valid = false
  }

  if (!form.cnpj.trim()) {
    fieldErrors.cnpj = 'CNPJ é obrigatório'
    valid = false
  } else if (!isValidCnpj(form.cnpj)) {
    fieldErrors.cnpj = 'CNPJ inválido'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  error.value = ''
  success.value = ''

  if (!validateForm()) {
    return
  }

  saving.value = true

  try {
    await createCompany(form)
    success.value = 'Empresa cadastrada com sucesso'
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao salvar empresa'

    if (message === 'CNPJ já cadastrado') {
      fieldErrors.cnpj = message
    } else {
      error.value = message
    }
  } finally {
    saving.value = false
  }
}

</script>

<template>
  <main>
    <div class="toolbar">
      <div>
        <h1>Cadastrar empresa</h1>
        <p class="subtle">Crie um novo cadastro para entrar na listagem.</p>
      </div>

      <RouterLink class="secondary-link" to="/empresas">Voltar para a lista</RouterLink>
    </div>

    <p v-if="error" class="notice-error">{{ error }}</p>
    <p v-if="success" class="notice-success">{{ success }}</p>

    <form class="stack" @submit.prevent="handleSubmit">
      <div class="field">
        <label for="name">Nome</label>
        <input id="name" v-model="form.name" type="text" />
        <p v-if="fieldErrors.name" class="field-error">{{ fieldErrors.name }}</p>
      </div>

      <div class="field">
        <label for="cnpj">CNPJ</label>
        <input id="cnpj" v-model="form.cnpj" type="text" />
        <p v-if="fieldErrors.cnpj" class="field-error">{{ fieldErrors.cnpj }}</p>
      </div>

      <div class="field">
        <label for="status">Status</label>
        <select id="status" v-model.number="form.status">
          <option :value="1">Ativa</option>
          <option :value="0">Inativa</option>
        </select>
      </div>

      <button type="submit" :disabled="saving">
        {{ saving ? 'Salvando...' : 'Salvar' }}
      </button>
    </form>
  </main>
</template>
