import { InvalidOrderStatusError } from "@domain/errors";
import { Either, left, right } from "src/shared/either";

export enum OrderStatusType {
  Aguardando_pagamento = "Aguardando pagamento",
  Recebido = "Recebido",
  Em_preparação = "Em preparação",
  Pronto = "Pronto",
  Finalizado = "Finalizado",
}

export class OrderStatus {
  private readonly value: string;

  constructor(status: string) {
    this.value = status;
  }

  public getValue(): string {
    return this.value;
  }

  public static create(
    value: string
  ): Either<InvalidOrderStatusError, OrderStatus> {
    const validCategories: string[] = Object.values(OrderStatusType);
    if (!validCategories.includes(value)) {
      return left(new InvalidOrderStatusError(value));
    }
    return right(new OrderStatus(value));
  }
}
