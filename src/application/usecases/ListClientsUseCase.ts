import { IClientDao } from "@application/usecases/ports/IClientDao";

export class ListClientsUseCase {
  constructor(readonly dao: IClientDao) {}
  async execute() {
    return this.dao.list();
  }
}
