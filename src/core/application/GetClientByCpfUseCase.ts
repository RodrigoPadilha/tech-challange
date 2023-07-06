import { IClientRepository } from "./ports/IClientRepository";

export class GetClientByCpfUseCase {
  constructor(readonly repository: IClientRepository) {}
  async execute() {
    return this.repository.list();
  }
}
