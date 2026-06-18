<script setup>
import { ref, onMounted } from 'vue'
import { getCompanyById } from '@/services/companyService'
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
        <div class="toolbar">
            <div>
                <h1>Detalhes da Empresa</h1>
                <p class="subtle">Visão geral do cadastro selecionado.</p>
            </div>

            <RouterLink class="secondary-link" to="/empresas">Voltar para a lista</RouterLink>
        </div>

        <p v-if="loading" class="subtle">Carregando detalhes da empresa...</p>

        <p v-else-if="error" class="notice-error">{{ error }}</p>

        <section v-else-if="company" class="card-grid">
            <article>
                <h2>{{ company.name }}</h2>
                <p>CNPJ: {{ company.cnpj }}</p>
                <span
                    class="status-pill"
                    :class="company.status === 1 ? 'status-active' : 'status-inactive'"
                >
                    {{ company.status === 1 ? 'Ativa' : 'Inativa' }}
                </span>
            </article>
        </section>
    </main>
</template>
