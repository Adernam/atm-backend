export interface IRemoveClient {
  removeClient: (id: string) => Promise<void>
}
