import { ClientEntity } from "@application/entities/ClientEntity";
import { OrderEntity } from "@application/entities/OrderEntity";
import { ProductEntity } from "@application/entities/ProductEntity";
import { OrderFilter } from "@application/usecases/ports/IOrderDao";
import { ProductFilter } from "@application/usecases/ports/IProductDao";

export interface IConnectionDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getConnection(): any;

  listClients(): Promise<any>;
  saveClient(newClient: ClientEntity): Promise<any>;
  getClientByCpf(cpf: string): Promise<any>;

  listOrders(filter?: OrderFilter): Promise<any>;
  saveOrder(newOrder: OrderEntity): Promise<any>;
  updateOrder(newOrder: OrderEntity): Promise<any>;
  findOrderById(id: string): Promise<any>;

  listProduct(filter?: ProductFilter): Promise<any>;
  saveProduct(newProduct: ProductEntity): Promise<any>;
  updateProduct(newProduct: ProductEntity): Promise<any>;
  findProductById(id: string): Promise<any>;
  removeProduct(id: string): Promise<any>;
  getProductsByIds(productIds: string[]): Promise<any>;
}
