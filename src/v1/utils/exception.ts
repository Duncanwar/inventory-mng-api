export class CustomException extends Error {
  name: string;
  statusCode: number;

  constructor(message: string, name: string, statusCode: number) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

export class BadRequestException extends CustomException {
  constructor(message?: string) {
    super(message || "Bad Request", "BadRequestException", 400);
  }
}

export class NotFoundException extends CustomException {
  constructor(message?: string) {
    super(message || "Not Found", "NotFoundException", 404);
  }
}

export class ConflictException extends CustomException {
  constructor(message?: string) {
    super(message || "Conflict", "ConflictException", 409);
  }
}
