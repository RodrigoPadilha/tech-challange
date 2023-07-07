import { IProductRepository } from "./ports/IProductRepository";

export class ListProductsUseCase {
  constructor(readonly repository: IProductRepository) {}
  async execute() {
    return this.repository.list();
  }
}
