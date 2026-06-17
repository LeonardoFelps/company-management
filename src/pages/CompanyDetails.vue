<script setup>
import { ref, onMounted } from 'vue'
import { getCompanyById, updateCompany } from '@/services/companyService'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id

const company = ref(null)
const loading = ref(false)
const error = ref('')

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
        <h1>Detalhes da Empresa</h1>

        <p>
            <RouterLink to="/empresas">Voltar para a lista</RouterLink>
        </p>

        <p v-if="loading">Carregando detalhes da empresa...</p>

        <p v-else-if="error">{{ error }}</p>

        <section v-else-if="company">
            <article>
                <h2>{{ company.name }}</h2>
                <p>CNPJ: {{ company.cnpj }}</p>
                <p>Status: {{ company.status === 1 ? 'Ativa' : 'Inativa' }}</p>
            </article>
        </section>
    </main>
</template>
