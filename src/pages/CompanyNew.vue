<script setup>
import { reactive, ref } from 'vue'
import { createCompany } from '@/services/companyService'

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
    error.value = err instanceof Error ? err.message : 'Erro ao salvar empresa'
  } finally {
    saving.value = false
  }
}

</script>

<template>
  <main>
    <h1>Cadastrar empresa</h1>

    <p>
      <RouterLink to="/empresas">Voltar para a lista</RouterLink>
    </p>

    <p v-if="error">{{ error }}</p>

    <form @submit.prevent="handleSubmit">
      <div>
        <label for="name">Nome</label>
        <input id="name" v-model="form.name" type="text" />
        <p v-if="fieldErrors.name">{{ fieldErrors.name }}</p>
      </div>

      <div>
        <label for="cnpj">CNPJ</label>
        <input id="cnpj" v-model="form.cnpj" type="text" />
        <p v-if="fieldErrors.cnpj">{{ fieldErrors.cnpj }}</p>
      </div>

      <div>
        <label for="status">Status</label>
        <select id="status" v-model.number="form.status">
          <option :value="1">Ativa</option>
          <option :value="0">Inativa</option>
        </select>
      </div>

      <button type="submit" :disabled="saving">
        {{ saving ? 'Salvando...' : 'Salvar' }}
      </button>

      <p v-if="success">{{ success }}</p>
    </form>
  </main>
</template>
