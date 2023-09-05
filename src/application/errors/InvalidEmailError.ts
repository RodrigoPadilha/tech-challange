export class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`Email inválido: ${email}`);
    this.name = "InvalidEmailError";
  }
}
