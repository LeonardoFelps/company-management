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

export async function createCompany(data) {
    await delay()

    const newCompany = {
        id: Date.now(),
        name: data.name,
        cnpj: data.cnpj,
        status: data.status,
        users: [],
    }

    companies.push(newCompany)
    return JSON.parse(JSON.stringify(newCompany))
}

export async function updateCompany(id, data){
    await delay()

    const company = companies.find((item) => item.id === Number(id))

    if (!company) {
        throw new Error('Empresa não encontrada')
    }

    company.name = data.name
    company.cnpj = data.cnpj
    company.status = data.status

    return JSON.parse(JSON.stringify(company))
}

export async function deleteCompany(id) {
  await delay()

  const index = companies.findIndex((item) => item.id === Number(id))

  if (index === -1) {
    throw new Error('Empresa não encontrada')
  }

  companies.splice(index, 1)

  return true
}