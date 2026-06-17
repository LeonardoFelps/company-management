export const companies = [
  {
    id: 1,
    name: 'Empresa Alpha',
    cnpj: '00.000.000/0001-00',
    status: 1,
    users: [
      {
        id: 1,
        name: 'Joao Silva',
        email: 'joao@alpha.com',
        role: 'Administrador',
      },
      {
        id: 2,
        name: 'Maria Souza',
        email: 'maria@alpha.com',
        role: 'Analista',
      },
    ],
  },
  {
    id: 2,
    name: 'Empresa Beta',
    cnpj: '11.111.111/0001-11',
    status: 0,
    users: [
      {
        id: 3,
        name: 'Mauro Santos',
        email: 'mauro@beta.com',
        role: 'Administrador',
      },
    ],
  },
  {
    id: 3,
    name: 'Empresa Gama',
    cnpj: '22.222.222/0001-22',
    status: 1,
    users: [
      {
        id: 4,
        name: 'Tiago Mendes',
        email: 'tiago@gama.com',
        role: 'Gerente',
      },
    ],
  },
]
