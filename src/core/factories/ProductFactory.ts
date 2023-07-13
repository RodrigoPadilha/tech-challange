import IHttpServer from "@application/ports/IHttpServer";
import { ProductController } from "../infra/api/controllers/ProductController";
import { ListProductsUseCase } from "@application/ListProductsUsewCase";
// import { ProductMemoryRepository } from "@adapters/Driven/ProductMemoryRepository";
import { CreateProductUseCase } from "@application/CreateProductUseCase";
import { DeleteProductUseCase } from "@application/DeleteProductUseCase";
import { UpdateProductUseCase } from "@application/UpdateProductUseCase";
import { ProductDatabaseRepository } from "@adapters/Driven/ProductDatabaseRepository";
import { IConnectionDatabase } from "@application/ports/IConnectionDatabase";

export class ProductFactory {
  private readonly productController: ProductController;
  // private readonly productRepository: ProductMemoryRepository;
  private readonly productRepository: ProductDatabaseRepository;

  constructor(
    private readonly httpServer: IHttpServer,
    private readonly connection: IConnectionDatabase
  ) {
    this.productController = new ProductController(this.httpServer);
    // this.productRepository = new ProductMemoryRepository();
    this.productRepository = new ProductDatabaseRepository(this.connection);
  }

  makeListProductsController = () => {
    this.productController.registerEndpointListProducts(
      new ListProductsUseCase(this.productRepository)
    );
  };

  makeCreateProductController = () => {
    this.productController.registerEndpointCreateProduct(
      new CreateProductUseCase(this.productRepository)
    );
  };

  makeDeleteProductController = () => {
    this.productController.registerEndpointDeleteProduct(
      new DeleteProductUseCase(this.productRepository)
    );
  };

  makeUpdateProductController = () => {
    this.productController.registerEndpointUpdateProduct(
      new UpdateProductUseCase(this.productRepository)
    );
  };
}
