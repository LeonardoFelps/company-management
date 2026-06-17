let companiesStore = []
let storeLoaded = false
let storePromise = null

function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

function normalizeCnpj(value) {
  return String(value).replace(/\D/g, '')
}

async function ensureStoreLoaded() {
  if (storeLoaded) {
    return companiesStore
  }

  if (!storePromise) {
    storePromise = fetch('/mock/companies.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao carregar empresas da API fake')
        }

        return response.json()
      })
      .then((data) => {
        companiesStore = data
        storeLoaded = true
        return companiesStore
      })
  }

  return storePromise
}

function hasDuplicateCnpj(cnpj, currentId) {
  const normalizedCnpj = normalizeCnpj(cnpj)

  return companiesStore.some((company) => {
    const isSameCompany = currentId != null && company.id === Number(currentId)
    return !isSameCompany && normalizeCnpj(company.cnpj) === normalizedCnpj
  })
}

export async function listCompanies(page = 1, perPage = 5) {
  await delay()
  await ensureStoreLoaded()

  const total = companiesStore.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const currentPage = Math.min(Math.max(1, Number(page)), totalPages)
  const start = (currentPage - 1) * perPage
  const end = start + perPage

  return {
    items: clone(companiesStore.slice(start, end)),
    total,
    page: currentPage,
    perPage,
    totalPages,
  }
}

export async function getCompanyById(id) {
  await delay()
  await ensureStoreLoaded()

  const company = companiesStore.find((item) => item.id === Number(id))

  if (!company) {
    throw new Error('Empresa não encontrada')
  }

  return clone(company)
}

export async function createCompany(data) {
  await delay()
  await ensureStoreLoaded()

  if (hasDuplicateCnpj(data.cnpj)) {
    throw new Error('CNPJ já cadastrado')
  }

  const newCompany = {
    id: Date.now(),
    name: data.name,
    cnpj: data.cnpj,
    status: data.status,
    users: [],
  }

  companiesStore.push(newCompany)
  return clone(newCompany)
}

export async function updateCompany(id, data) {
  await delay()
  await ensureStoreLoaded()

  const company = companiesStore.find((item) => item.id === Number(id))

  if (!company) {
    throw new Error('Empresa não encontrada')
  }

  if (hasDuplicateCnpj(data.cnpj, id)) {
    throw new Error('CNPJ já cadastrado')
  }

  company.name = data.name
  company.cnpj = data.cnpj
  company.status = data.status

  return clone(company)
}

export async function deleteCompany(id) {
  await delay()
  await ensureStoreLoaded()

  const index = companiesStore.findIndex((item) => item.id === Number(id))

  if (index === -1) {
    throw new Error('Empresa não encontrada')
  }

  companiesStore.splice(index, 1)

  return true
}
