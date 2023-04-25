export interface IHashEncode {
  encode: (value: any) => Promise<string>
}

export interface IHashDecode {
  decode: (token: string) => Promise<any>
}
