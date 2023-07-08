import IHttpServer from "@application/ports/IHttpServer";

export class OrderController {
  constructor(private readonly httpServer: IHttpServer) {}
}
