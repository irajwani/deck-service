import { DeckTypes } from '../../Types/deck';
import { cardsStub } from './cards.stub';
import { Deck } from '../../../../Schemas/deck.schema';

export const decksStub: Record<string, Deck> = {
  // full shuffled deck
  T1: {
    deckId: 'fa070707-54cf-4a68-8d7e-13529b339793',
    type: DeckTypes.FULL,
    isShuffled: true,
    cards: cardsStub.T1,
    remaining: 52,
  },
  // full unshuffled deck

  // short shuffled deck

  // short unshuffled deck

  // deck with top 4 cards drawn from full shuffled deck
};
