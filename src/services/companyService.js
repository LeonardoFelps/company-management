import { companies } from '@/mocks/db'

function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

export async function listCompanies(page = 1, perPage = 5) {
  await delay()

  const total = companies.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const currentPage = Math.min(Math.max(1, Number(page)), totalPages)
  const start = (currentPage - 1) * perPage
  const end = start + perPage

  return {
    items: clone(companies.slice(start, end)),
    total,
    page: currentPage,
    perPage,
    totalPages,
  }
}

export async function getCompanyById(id) {
  await delay()

  const company = companies.find((item) => item.id === Number(id))

  if (!company) {
    throw new Error('Empresa não encontrada')
  }

  return clone(company)
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
  return clone(newCompany)
}

export async function updateCompany(id, data) {
  await delay()

  const company = companies.find((item) => item.id === Number(id))

  if (!company) {
    throw new Error('Empresa não encontrada')
  }

  company.name = data.name
  company.cnpj = data.cnpj
  company.status = data.status

  return clone(company)
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
