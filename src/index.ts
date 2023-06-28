import { ExpressAdapter } from "@adapters/Driver/ExpressAdapter";
import IHttpServer from "@application/ports/IHttpServer";
import Router from "src/core/infra/api/Router";

const httpServer: IHttpServer = new ExpressAdapter();
const router = new Router(httpServer);

router.start();
httpServer.start(Number(process.env.SERVER_PORT) || 3000);
