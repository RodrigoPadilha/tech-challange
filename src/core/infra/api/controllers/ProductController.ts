import { ListProductsUseCase } from "@application/ListProductsUsewCase";
import IHttpServer from "@application/ports/IHttpServer";
import { ok, serverError } from "src/core/util/http-helper";

export class ProductController {
  constructor(private readonly httpServer: IHttpServer) {}

  registerListAllProducts(listAllProductsUseCase: ListProductsUseCase) {
    this.httpServer.register("get", "/product", async function () {
      try {
        return ok([{ description: "", price: 9.9, category: "bebida" }]);
      } catch (error) {
        return serverError(error);
      }
    });
  }
}
