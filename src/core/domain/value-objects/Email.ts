import { InvalidEmailError } from "@domain/errors";
import { Either, left, right } from "src/shared/either";

export class Email {
  private readonly value: string;

  constructor(email: string = "") {
    this.value = email;
  }

  public getValue(): string {
    return this.value;
  }

  public static isValidEmail(email: string) {
    if (!email || email.length === 0) {
      return true;
    }
    if (email.length > 320) {
      return false;
    }

    const emailRegex =
      /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    if (!emailRegex.test(email)) {
      return false;
    }

    const [local, domain] = email.split("@");
    if (local.length > 64 || local.length === 0) {
      return false;
    }

    if (domain.length > 255 || domain.length === 0) {
      return false;
    }

    const domainParts = domain.split(".");
    if (
      domainParts.some(function (part) {
        return part.length > 63;
      })
    ) {
      return false;
    }

    return true;
  }

  public static create(email: string): Either<InvalidEmailError, Email> {
    if (!this.isValidEmail(email)) {
      return left(new InvalidEmailError(email));
    }
    return right(new Email(email));
  }
}
