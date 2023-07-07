import IHttpServer from "@application/ports/IHttpServer";
import { ProductController } from "../infra/api/controllers/ProductController";
import { ListProductsUseCase } from "@application/ListProductsUsewCase";
import { ProductMemoryRepository } from "@adapters/Driven/ProductMemoryRepository";

export class ProductFactory {
  private readonly productController: ProductController;
  private readonly productRepository: ProductMemoryRepository;

  constructor(private readonly httpServer: IHttpServer) {
    this.productController = new ProductController(this.httpServer);
    this.productRepository = new ProductMemoryRepository();
  }

  makeListAllProductsController = () => {
    this.productController.registerListAllProducts(
      new ListProductsUseCase(this.productRepository)
    );
  };
}
