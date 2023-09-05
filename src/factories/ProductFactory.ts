import IHttpServer from "@adapters/ports/IHttpServer";
import { IConnectionDatabase } from "@adapters/ports/IConnectionDatabase";
import { ProductController } from "src/controllers/ProductController";
import { ListProductsUseCase } from "@application/usecases/ListProductsUseCase";
import { CreateProductUseCase } from "@application/usecases/CreateProductUseCase";
import { DeleteProductUseCase } from "@application/usecases/DeleteProductUseCase";
import { UpdateProductUseCase } from "@application/usecases/UpdateProductUseCase";
import { ProductDao } from "src/dao/ProductDao";

export class ProductFactory {
  private readonly productController: ProductController;
  private readonly productDao: ProductDao;

  constructor(
    private readonly httpServer: IHttpServer,
    private readonly connection: IConnectionDatabase
  ) {
    this.productController = new ProductController(this.httpServer);
    this.productDao = new ProductDao(this.connection);
  }

  makeListProductsController = () => {
    this.productController.registerEndpointListProducts(
      new ListProductsUseCase(this.productDao)
    );
  };

  makeCreateProductController = () => {
    this.productController.registerEndpointCreateProduct(
      new CreateProductUseCase(this.productDao)
    );
  };

  makeDeleteProductController = () => {
    this.productController.registerEndpointDeleteProduct(
      new DeleteProductUseCase(this.productDao)
    );
  };

  makeUpdateProductController = () => {
    this.productController.registerEndpointUpdateProduct(
      new UpdateProductUseCase(this.productDao)
    );
  };
}
