export type ClientDTO = {
  email?: string
  name?: string
  address?: string
  birthDate?: string
  cpf?: string
  password?: string
  active?: boolean
  deletedAt?: string
}

export type SigninDTO = {
  email: string
  password: string
}
