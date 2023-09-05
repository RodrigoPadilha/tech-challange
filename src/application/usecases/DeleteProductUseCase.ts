import { ProductEntity } from "@application/entities/ProductEntity";
import { IProductDao } from "@application/usecases/ports/IProductDao";
import { Either, left, right } from "src/shared/either";
import { DeleteProductError, ProductNotFoundError } from "src/dao/errors";

interface Input {
  id: string;
}
export class DeleteProductUseCase {
  constructor(private readonly dao: IProductDao) {}

  async execute(
    input: Input
  ): Promise<Either<ProductNotFoundError | DeleteProductError, ProductEntity>> {
    const deleteProductOutput = await this.dao.remove(input.id);
    if (deleteProductOutput.isLeft()) {
      return left(deleteProductOutput.value);
    }
    return right(deleteProductOutput.value as ProductEntity);
  }
}
