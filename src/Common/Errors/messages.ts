const ERRORS = {
  INTERNAL_SERVER: {
    code: -1,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Internal Server Error',
  },
  INVALID_CREDENTIALS: {
    code: 2,
    error: 'INVALID_CREDENTIALS_ERROR',
    message: 'Incorrect email/password',
  },
  INSUFFICIENT_PERMISSION: {
    code: 3,
    error: 'INSUFFICIENT_PERMISSION_ERROR',
    message:
      'You are not authorized. Please use a valid set of credentials or a valid jwt.',
  },
  DECK_EXISTS: {
    code: 4,
    error: 'DECK_EXISTS_ERROR',
    message: 'Deck with this id already exists',
  },
  DECK_NOT_FOUND: {
    code: 5,
    error: 'DECK_NOT_FOUND',
    message: 'Deck does not exist. Please provide a valid Deck ID.',
  },
  INVALID_DRAW: {
    code: 6,
    error: 'INVALID_DRAW',
    message:
      'Attempting to draw more cards than amount left in deck. Please lower your draw count.',
  },
  EMPTY_DECK: {
    code: 7,
    error: 'EMPTY_DECK',
    message:
      'This deck no cards left to draw. You may continue/restart the game with a fresh deck.',
  },
};

export { ERRORS };
