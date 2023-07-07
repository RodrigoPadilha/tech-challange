import IHttpServer from "@application/ports/IHttpServer";
import { ProductController } from "../infra/api/controllers/ProductController";
import { ListProductsUseCase } from "@application/ListProductsUsewCase";
import { ProductMemoryRepository } from "@adapters/Driven/ProductMemoryRepository";
import { CreateProductUseCase } from "@application/CreateProductUseCase";

export class ProductFactory {
  private readonly productController: ProductController;
  private readonly productRepository: ProductMemoryRepository;

  constructor(private readonly httpServer: IHttpServer) {
    this.productController = new ProductController(this.httpServer);
    this.productRepository = new ProductMemoryRepository();
  }

  makeListAllProductsController = () => {
    this.productController.registerEndpointListAllProducts(
      new ListProductsUseCase(this.productRepository)
    );
  };

  makeCreateProductController = () => {
    this.productController.registerEndpointCreateProduct(
      new CreateProductUseCase(this.productRepository)
    );
  };
}
