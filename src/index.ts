import { ExpressAdapter } from "src/adapters/ExpressAdapter";
import { PrismaConnection } from "src/adapters/PrismaConnection";
import IHttpServer from "@adapters/ports/IHttpServer";
import Router from "./infra/Router";

const httpServer: IHttpServer = new ExpressAdapter();
const connection = new PrismaConnection();

const router = new Router(httpServer, connection);

router.start();
httpServer.start(Number(process.env.SERVER_PORT) || 3000);
