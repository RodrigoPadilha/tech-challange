import { ListOrdersUseCase } from "@application/ListOrdersUseCase";
import IHttpServer from "@application/ports/IHttpServer";
import { badRequest, ok, serverError } from "src/core/util/http-helper";

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
            status: order.getStatus(),
            clientKey: order.getClientKey(),
            amount: order.getAmount(),
            amountFormated: order.getAmount(),
            productList: order.getProductList().map((product) => product),
          }));
          return ok(ordersDto);
        } catch (error) {
          return serverError(error);
        }
      }
    );
  }
}
