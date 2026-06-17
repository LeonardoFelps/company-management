function onlyDigits(value) {
  return String(value).replace(/\D/g, '')
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
