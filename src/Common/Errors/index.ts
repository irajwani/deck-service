import { HttpException, HttpStatus } from '@nestjs/common';
import { ERRORS } from './messages';

export class InternalServerException extends HttpException {
  constructor() {
    super(ERRORS.INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super(ERRORS.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST);
  }
}

export class InsufficientPermissionException extends HttpException {
  constructor() {
    super(ERRORS.INSUFFICIENT_PERMISSION, HttpStatus.FORBIDDEN);
  }
}

export class DeckExistsException extends HttpException {
  constructor() {
    super(ERRORS.DECK_EXISTS, HttpStatus.BAD_REQUEST);
  }
}

export class DeckNotFoundException extends HttpException {
  constructor() {
    super(ERRORS.DECK_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class InvalidDrawException extends HttpException {
  constructor() {
    super(ERRORS.INVALID_DRAW, HttpStatus.BAD_REQUEST);
  }
}

export class EmptyDeckException extends HttpException {
  constructor() {
    super(ERRORS.EMPTY_DECK, HttpStatus.BAD_REQUEST);
  }
}

export enum MongooseErrorCodes {
  UniquePropViolation = '11000',
}
