import { ListOrdersUseCase } from "@application/ListOrdersUseCase";
import IHttpServer from "@application/ports/IHttpServer";
import { badRequest, ok, serverError } from "src/core/util/http-helper";
import { validateProps } from "./validateProps";
import { MissingParamError } from "../../errors/MissingParamError";
import { CreateOrderUseCase } from "@application/CreateOrderUseCase";
import { CheckoutOrderUseCase } from "@application/CheckoutOrderUseCase";

export class OrderController {
  constructor(private readonly httpServer: IHttpServer) {}

  registerEndpointListOrders(listOrdersUseCase: ListOrdersUseCase) {
    this.httpServer.register(
      "get",
      "/order",
      async function (params: any, body: any, query: any) {
        try {
          const result = await listOrdersUseCase.execute();
          if (result.isLeft()) {
            return badRequest({ error: result.value.message });
          }
          const ordersDto = result.value.map((order) => ({
            id: order.id,
            status: order.getStatus().getValue(),
            clientKey: order.getClientKey(),
            totalAmount: order.getTotalAmount().getValue(),
            totalAmountFormatted: order.getTotalAmountFormatted(),
            productList: order.getProducts().map((product) => ({
              description: product.getDescription(),
              category: product.getCategory(),
              price: product.getPrice(),
              priceFormatted: product.getPriceFormatted(),
            })),
          }));
          return ok(ordersDto);
        } catch (error) {
          return serverError(error);
        }
      }
    );
  }

  registerEndpointCreateOrder(createOrderUseCase: CreateOrderUseCase) {
    this.httpServer.register(
      "post",
      "/order",
      async function (params: any, body: any) {
        try {
          const missingProps = validateProps(["key", "products"], body);
          if (missingProps.length > 0) {
            const missingParam = missingProps.join(" ");
            return badRequest({
              error: new MissingParamError(missingParam.trim()).message,
            });
          }
          const { key, products } = body;
          const result = await createOrderUseCase.execute({ key, products });
          if (result.isLeft()) {
            return badRequest({ error: result.value.message });
          }

          const orderDto = {
            id: result.value.id,
            status: result.value.getStatus().getValue(),
            clientKey: result.value.getClientKey(),
            totalAmount: result.value.getTotalAmount().getValue(),
            totalAmountFormatted: result.value.getTotalAmountFormatted(),
            productList: result.value.getProducts().map((product) => ({
              description: product.getDescription(),
              category: product.getCategory(),
              price: product.getPrice(),
              priceFormatted: product.getPriceFormatted(),
            })),
          };
          return ok(orderDto);
        } catch (error) {
          return serverError(error);
        }
      }
    );
  }

  registerEndpointCheckoutOrder(checkoutOrderUseCase: CheckoutOrderUseCase) {
    this.httpServer.register(
      "patch",
      "/order/checkout/:id",
      async function (params: any, body: any) {
        try {
          console.log("===> Chegou id", params.id);
          const result = await checkoutOrderUseCase.execute({
            orderId: params.id,
          });
          if (result.isLeft()) {
            return badRequest({ error: result.value.message });
          }
          return ok({
            orderId: result.value.id,
            newStatus: result.value.getStatus().getValue(),
          });
        } catch (error) {
          return serverError(error);
        }
      }
    );
  }
}
