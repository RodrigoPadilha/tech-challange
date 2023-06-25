import { Server } from "http";
import express, { Application, Request, Response } from "express";
import IHttpServer from "src/core/application/ports/IHttpServer";

export class ExpressAdapter implements IHttpServer {
  private app: Application;
  private server: Server;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupHealthCheck();
  }

  private setupMiddlewares() {
    this.app.use(express.json());
  }

  private setupHealthCheck(): void {
    this.app.get("/", (req, resp) => {
      resp.send(`Hello World ${process.env.DB_HOST}: ${process.env.DB_PORT}`);
    });
  }

  async register(
    method: string,
    url: string,
    callback: Function
  ): Promise<void> {
    this.app[method](url, async function (req: Request, res: Response) {
      const output = await callback(req.params, req.body);
      res.json(output);
    });
  }

  async start(port: number): Promise<void> {
    console.log(`> [ExpressAdapter] starting...`);
    this.server = this.app.listen(port, () => {
      console.log(`> [ExpressAdapter] Server is running on port ${port}`);
    });
  }

  async stop(): Promise<void> {
    if (this.server) {
      this.server.close();
      console.log("> [ExpressAdapter] Server has been stopped");
    }
  }
}
