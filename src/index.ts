import { ExpressAdapter } from "@adapters/Driver/ExpressAdapter";
import { PrismaConnection } from "@adapters/Driver/PrismaConnection";
import IHttpServer from "@application/ports/IHttpServer";
import Router from "src/core/infra/api/Router";

const httpServer: IHttpServer = new ExpressAdapter();
const connection = new PrismaConnection();

const router = new Router(httpServer, connection);

router.start();
httpServer.start(Number(process.env.SERVER_PORT) || 3000);
