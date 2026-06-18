function onlyDigits(value) {
  return String(value).replace(/\D/g, '')
}

export function formatCnpj(value) {
  const digits = onlyDigits(value).slice(0, 14)

  if (digits.length <= 2) {
    return digits
  }

  if (digits.length <= 5) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`
  }

  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  }

  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

export function maskCnpj(value) {
  const digits = onlyDigits(value)

  if (digits.length < 14) {
    return formatCnpj(value)
  }

  return '••.•••.•••/••••-••'
}

function calculateCheckDigit(base, weights) {
  const sum = base.split('').reduce((acc, digit, index) => {
    return acc + Number(digit) * weights[index]
  }, 0)

  const remainder = sum % 11
  return remainder < 2 ? 0 : 11 - remainder
}

export function isValidCnpj(value) {
  const cnpj = onlyDigits(value)

  if (cnpj.length !== 14) {
    return false
  }

  if (/^(\d)\1+$/.test(cnpj)) {
    return false
  }

  const base = cnpj.slice(0, 12)
  const digit1 = calculateCheckDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const digit2 = calculateCheckDigit(`${base}${digit1}`, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])

  return cnpj === `${base}${digit1}${digit2}`
}
