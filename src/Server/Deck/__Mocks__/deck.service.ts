import { decksStub } from '../Test/Stubs/decks.stub';
import { cardsStub } from '../Test/Stubs/cards.stub';

export const DeckService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(decksStub.T1),
  findOne: jest.fn().mockResolvedValue(decksStub.T1),
  drawCards: jest.fn().mockResolvedValue(cardsStub.T4),
});
