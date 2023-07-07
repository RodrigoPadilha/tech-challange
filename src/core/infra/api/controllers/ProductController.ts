import { CreateProductUseCase } from "@application/CreateProductUseCase";
import { ListProductsUseCase } from "@application/ListProductsUsewCase";
import IHttpServer from "@application/ports/IHttpServer";
import {
  badRequest,
  created,
  ok,
  serverError,
} from "src/core/util/http-helper";
import { validateProps } from "./validateProps";
import { MissingParamError } from "../../errors/MissingParamError";

export class ProductController {
  constructor(private readonly httpServer: IHttpServer) {}

  registerEndpointCreateProduct(createProductUseCase: CreateProductUseCase) {
    this.httpServer.register(
      "post",
      "/product",
      async function (params: any, body: any) {
        try {
          const missingProps = validateProps(
            ["description", "price", "category"],
            body
          );
          if (missingProps.length > 0) {
            const missingParam = missingProps.join(" ");
            return badRequest({
              error: new MissingParamError(missingParam.trim()).message,
            });
          }
          const { description, price, category } = body;
          const result = await createProductUseCase.execute({
            category,
            description,
            price,
          });
          if (result.isLeft()) {
            return badRequest({ error: result.value.message });
          }
          const productDto = {
            category: result.value.getCategory(),
          };
          return created({
            message: "Produto criado com sucesso!",
            product: productDto,
          });
        } catch (error) {
          return serverError(error);
        }
      }
    );
  }

  registerEndpointListAllProducts(listAllProductsUseCase: ListProductsUseCase) {
    this.httpServer.register("get", "/product", async function () {
      try {
        listAllProductsUseCase.execute();
        return ok([{ description: "", price: 9.9, category: "bebida" }]);
      } catch (error) {
        return serverError(error);
      }
    });
  }
}
