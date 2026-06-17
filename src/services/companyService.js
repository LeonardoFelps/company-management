import { companies } from '@/mocks/db'

function delay(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function listCompanies() {
    await delay()

    return JSON.parse(JSON.stringify(companies))
}

export async function getCompanyById(id) {
    await delay()

    const company = companies.find((item) => item.id === Number(id))

    if (!company) {
        throw new Error('Empresa não encontrada')
    }

    return JSON.parse(JSON.stringify(company))
}