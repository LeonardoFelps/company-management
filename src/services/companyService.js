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

function normalizeSearch(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function matchesCompanySearch(company, search) {
  const term = normalizeSearch(search)

  if (!term) {
    return true
  }

  const name = normalizeSearch(company.name)
  const cnpj = normalizeCnpj(company.cnpj)
  const status = company.status === 1 ? 'ativa' : 'inativa'

  const canMatchCnpj = /^\d+$/.test(term)
  const hasDigits = /\d/.test(term)
  const nameMatches = hasDigits ? name === term : name.includes(term)

  return nameMatches || (canMatchCnpj && cnpj.includes(normalizeCnpj(term))) || status.includes(term)
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

function hasDuplicateUserEmail(company, email, currentUserId) {
  const normalizedEmail = normalizeSearch(email)

  return company.users.some((user) => {
    const isSameUser = currentUserId != null && user.id === Number(currentUserId)
    return !isSameUser && normalizeSearch(user.email) === normalizedEmail
  })
}

export async function listCompanies(page = 1, perPage = 5, search = '') {
  await delay()
  await ensureStoreLoaded()

  const filteredCompanies = companiesStore.filter((company) => matchesCompanySearch(company, search))
  const total = filteredCompanies.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const currentPage = Math.min(Math.max(1, Number(page)), totalPages)
  const start = (currentPage - 1) * perPage
  const end = start + perPage

  return {
    items: clone(filteredCompanies.slice(start, end)),
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

export async function addUserToCompany(companyId, userData) {
  await delay()
  await ensureStoreLoaded()

  const company = companiesStore.find((item) => item.id === Number(companyId))

  if (!company) {
    throw new Error('Empresa não encontrada')
  }

  if (hasDuplicateUserEmail(company, userData.email)) {
    throw new Error('E-mail já cadastrado')
  }

  const newUser = {
    id: Date.now(),
    name: userData.name,
    email: userData.email,
    role: userData.role,
  }

  company.users.push(newUser)

  return clone(newUser)
}

export async function updateUserInCompany(companyId, userId, userData) {
  await delay()
  await ensureStoreLoaded()

  const company = companiesStore.find((item) => item.id === Number(companyId))

  if (!company) {
    throw new Error('Empresa não encontrada')
  }

  const user = company.users.find((item) => item.id === Number(userId))

  if (!user) {
    throw new Error('Usuário não encontrado')
  }

  if (hasDuplicateUserEmail(company, userData.email, userId)) {
    throw new Error('E-mail já cadastrado')
  }

  user.name = userData.name
  user.email = userData.email
  user.role = userData.role

  return clone(user)
}

export async function removeUserFromCompany(companyId, userId) {
  await delay()
  await ensureStoreLoaded()

  const company = companiesStore.find((item) => item.id === Number(companyId))

  if (!company){
    throw new Error('Empresa não encontrada')
  }

  const index = company.users.findIndex((user) => user.id === Number(userId))

  if (index === -1 ) {
    throw new Error('Usuário não encontrado')
  }

  company.users.splice(index, 1)

  return true
}
