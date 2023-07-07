export class ListClientError extends Error {
    constructor (data?: any) {
      super(`List client error. ${data && JSON.stringify(data)}`)
      this.name = 'ListClientError'
    }
  }
  