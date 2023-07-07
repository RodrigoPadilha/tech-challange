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

  registerEndpointListAllProducts(listAllProductsUseCase: ListProductsUseCase) {
    this.httpServer.register("get", "/product", async function () {
      try {
        const result = await listAllProductsUseCase.execute();
        if (result.isLeft()) {
          return badRequest({ error: result.value.message });
        }
        const productsDto = result.value.map((product) => ({
          desciption: product.getDescription(),
          price: product.getPrice(),
          priceFormated: product.getPriceFormated(),
          category: product.getCategory(),
        }));

        return ok(productsDto);
      } catch (error) {
        return serverError(error);
      }
    });
  }

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
}
