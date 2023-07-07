import { ProductEntity } from "@domain/entities/ProductEntity";
import { IProductRepository } from "./ports/IProductRepository";
import { Either, left, right } from "src/shared/either";
import {
  DeleteProductError,
  ProductNotFoundError,
} from "@adapters/Driven/errors";

interface Input {
  id: string;
}
export class DeleteProductUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async execute(
    input: Input
  ): Promise<Either<ProductNotFoundError | DeleteProductError, ProductEntity>> {
    const deleteProductOutput = await this.repository.remove(input.id);
    if (deleteProductOutput.isLeft()) {
      return left(deleteProductOutput.value);
    }
    return right(deleteProductOutput.value as ProductEntity);
  }
}
