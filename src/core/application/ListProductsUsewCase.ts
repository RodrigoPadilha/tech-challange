import { IProductRepository } from "./ports/IProductRepository";

export class ListProductsUseCase {
  constructor(private readonly repository: IProductRepository) {}
  async execute() {
    return this.repository.list();
  }
}
