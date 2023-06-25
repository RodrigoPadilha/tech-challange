export default interface IHttpServer {
  register(method: string, url: string, callback: Function): Promise<void>;
  start(port: number): Promise<void>;
  stop(): Promise<void>;
}
