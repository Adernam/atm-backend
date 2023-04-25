export interface IEncrypt {
  encrypt: (payload: string) => string
}

export interface IEncryptCompare {
  compare: (password: string, passwordHashed: string) => Promise<boolean>
}
