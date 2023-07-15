import { ListOrdersUseCase } from "@application/ListOrdersUseCase";
import IHttpServer from "@application/ports/IHttpServer";
import { badRequest, ok, serverError } from "src/core/util/http-helper";
import { validateProps } from "./validateProps";
import { MissingParamError } from "../../errors/MissingParamError";
import { CreateOrderUseCase } from "@application/CreateOrderUseCase";
import { CheckoutOrderUseCase } from "@application/CheckoutOrderUseCase";
import { UpdateOrderUseCase } from "@application/UpdateOrderUseCase";

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
              description: product.product.getDescription(),
              category: product.product.getCategory(),
              price: product.product.getPrice(),
              priceFormatted: product.product.getPriceFormatted(),
              quantity: product.quantity,
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
              description: product.product.getDescription(),
              category: product.product.getCategory(),
              price: product.product.getPrice(),
              priceFormatted: product.product.getPriceFormatted(),
              quantity: product.quantity,
            })),
          };
          return ok(orderDto);
        } catch (error) {
          return serverError(error);
        }
      }
    );
  }

  registerEndpointUpdateOrder(updateOrderUseCase: UpdateOrderUseCase) {
    this.httpServer.register(
      "put",
      "/order/:id",
      async function (params: any, body: any) {
        try {
          const missingProps = validateProps(["newOrderStatus"], body);
          if (missingProps.length > 0) {
            const missingParam = missingProps.join(" ");
            return badRequest({
              error: new MissingParamError(missingParam.trim()).message,
            });
          }

          const result = await updateOrderUseCase.execute({
            orderId: params.id,
            newOrderStatus: body.newOrderStatus,
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

  registerEndpointCheckoutOrder(checkoutOrderUseCase: CheckoutOrderUseCase) {
    this.httpServer.register(
      "patch",
      "/order/checkout/:id",
      async function (params: any, body: any) {
        try {
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
