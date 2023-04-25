export interface Validation {
  handle: (body: any) => void | Error | Promise<void | Error>
}
