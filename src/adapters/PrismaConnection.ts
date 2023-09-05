import { PrismaClient as BasePrismaClient } from "@prisma/client";
import {
  OrderStatus as OrderStatusPrisma,
  Category as CategoryPrisma,
} from "@prisma/client";
import { IConnectionDatabase } from "@adapters/ports/IConnectionDatabase";
import { ClientEntity } from "@application/entities/ClientEntity";
import { OrderEntity } from "@application/entities/OrderEntity";
import { OrderFilter } from "@application/usecases/ports/IOrderDao";
import { ProductEntity } from "@application/entities/ProductEntity";
import { ProductFilter } from "@application/usecases/ports/IProductDao";

export class PrismaClient extends BasePrismaClient {
  // Aqui você pode adicionar métodos personalizados ou personalizar o comportamento do PrismaClient, se necessário
}

export class PrismaConnection implements IConnectionDatabase {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  getConnection(): PrismaClient {
    return this.prisma;
  }

  async connect(): Promise<void> {
    // Lógica para conectar ao banco de dados
    await this.prisma.$connect();
  }

  async disconnect(): Promise<void> {
    // Lógica para desconectar do banco de dados
    await this.prisma.$disconnect();
  }

  async saveClient(newClient: ClientEntity): Promise<any> {
    const existingClient = await this.prisma.client.findFirst({
      where: { cpf: newClient.getCpf() },
    });
    if (existingClient) {
      return existingClient;
    }
    const createdClient = await this.prisma.client.create({
      data: {
        key: newClient.getKey(),
        is_anonymous: newClient.getIsAnonymous(),
        cpf: newClient.getCpf(),
        name: newClient.getName(),
        email: newClient.getEmail(),
      },
    });
    return createdClient;
  }

  async listClients(): Promise<any> {
    const clientsData = await this.prisma.client.findMany();
    return clientsData;
  }

  async getClientByCpf(cpf: string): Promise<any> {
    const clientFound = await this.prisma.client.findFirst({
      where: { cpf: cpf },
    });
    return clientFound;
  }

  async saveOrder(newOrder: OrderEntity): Promise<any> {
    const clientData = await this.prisma.client.findUnique({
      where: { key: newOrder.getClientKey() },
    });
    const createdOrder = await this.prisma.order.create({
      data: {
        status: OrderStatusPrisma[
          newOrder.getStatus().getValue()
        ] as OrderStatusPrisma,
        client_id: clientData.id,
        total_amount: newOrder.getTotalAmount().getValue(),
        products: {
          create: newOrder.getProducts().map((product) => ({
            quantity: product.quantity,
            product: {
              connect: { id: product.product.id },
            },
          })),
        },
      },
    });
    return createdOrder;
  }

  async listOrders(filter?: OrderFilter): Promise<any> {
    const ordersData = await this.prisma.order.findMany({
      where: {
        id: filter?.id,
      },
      include: {
        products: {
          select: {
            product: {
              select: {
                id: true,
                description: true,
                category: true,
                price: true,
              },
            },
            quantity: true,
          },
        },
        client: { select: { key: true } },
      },
    });
    return ordersData;
  }

  async findOrderById(id: string): Promise<any> {
    const orderFound = await this.prisma.order.findUnique({
      where: { id: id },
    });

    return orderFound;
  }

  async updateOrder(newOrder: OrderEntity): Promise<any> {
    const orderUpdated = await this.prisma.order.update({
      where: { id: newOrder.id },
      data: {
        status: OrderStatusPrisma[
          newOrder.getStatus().getValue()
        ] as OrderStatusPrisma,
        total_amount: newOrder.getTotalAmount().getValue(),
        products: {
          upsert: newOrder.getProducts().map((product) => ({
            where: {
              order_id_product_id: {
                order_id: newOrder.id,
                product_id: product.product.id,
              },
            },
            create: {
              product: {
                connect: { id: product.product.id },
              },
              quantity: product.quantity,
            },
            update: {},
          })),
        },
      },
    });
    return orderUpdated;
  }

  async listProduct(filter?: ProductFilter): Promise<any> {
    const productsData = await this.prisma.product.findMany({
      where: {
        id: filter?.id,
        category: CategoryPrisma[filter?.category.getValue()] as CategoryPrisma,
      },
    });
    return productsData;
  }

  async saveProduct(newProduct: ProductEntity): Promise<any> {
    const createdProduct = await this.prisma.product.create({
      data: {
        description: newProduct.getDescription(),
        price: newProduct.getPrice(),
        category: CategoryPrisma[newProduct.getCategory()] as CategoryPrisma,
      },
    });
    return createdProduct;
  }

  async updateProduct(newProduct: ProductEntity): Promise<any> {
    const productUpdated = await this.prisma.product.update({
      data: {
        description: newProduct.getDescription(),
        price: newProduct.getPrice(),
        category: CategoryPrisma[newProduct.getCategory()] as CategoryPrisma,
      },
      where: { id: newProduct.id },
    });
    return productUpdated;
  }

  async findProductById(id: string): Promise<any> {
    const productFound = await this.prisma.product.findUnique({
      where: { id: id },
    });
    return productFound;
  }

  async removeProduct(id: string): Promise<any> {
    const productDeleted = await this.prisma.product.delete({ where: { id } });
    return productDeleted;
  }

  async getProductsByIds(productIds: string[]): Promise<any> {
    const productsData = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
    return productsData;
  }
}
