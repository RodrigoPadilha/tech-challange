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
import { DeleteProductUseCase } from "@application/DeleteProductUseCase";
import { UpdateProductUseCase } from "@application/UpdateProductUseCase";

export class ProductController {
  constructor(private readonly httpServer: IHttpServer) {}

  registerEndpointListProducts(listProductsUseCase: ListProductsUseCase) {
    this.httpServer.register(
      "get",
      "/product",
      async function (params: any, body: any, query: any) {
        try {
          const result = await listProductsUseCase.execute({
            category: query.category,
          });
          if (result.isLeft()) {
            return badRequest({ error: result.value.message });
          }
          const productsDto = result.value.map((product) => ({
            id: product.id,
            desciption: product.getDescription(),
            price: product.getPrice(),
            priceFormatted: product.getPriceFormatted(),
            category: product.getCategory(),
          }));

          return ok(productsDto);
        } catch (error) {
          return serverError(error);
        }
      }
    );
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

  registerEndpointDeleteProduct(deleteProductUseCase: DeleteProductUseCase) {
    this.httpServer.register(
      "delete",
      "/product/:id",
      async function (params: any, body: any) {
        try {
          const result = await deleteProductUseCase.execute({
            id: params.id,
          });
          if (result.isLeft()) {
            return badRequest({ error: result.value.message });
          }

          return ok({
            message: "Produto removido com sucesso.",
            product: `${result.value.id} - ${result.value.getDescription()}`,
          });
        } catch (error) {
          return serverError(error);
        }
      }
    );
  }

  registerEndpointUpdateProduct(updateProductUseCase: UpdateProductUseCase) {
    this.httpServer.register(
      "put",
      "/product/:id",
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

          const { price, description, category } = body;
          const result = await updateProductUseCase.execute({
            id: params.id,
            price,
            description,
            category,
          });

          if (result.isLeft()) {
            return badRequest({ error: result.value.message });
          }
          const productDto = {
            id: result.value.id,
            price: result.value.getPrice(),
            priceFormatted: result.value.getPriceFormatted(),
            description: result.value.getDescription(),
            category: result.value.getCategory(),
          };
          return ok({
            message: "Produto atualizado com sucesso.",
            product: productDto,
          });
        } catch (error) {
          return serverError(error);
        }
      }
    );
  }
}
