import { DeckTypes } from '../../Types/deck';
import { cardsStub } from './cards.stub';
import { Deck } from '../../../../Schemas/deck.schema';

// S1T1 => Suite 1, Test 1 => As in, Suite N refers to API endpoint N, and Test N refers to Test case N.
// S1 => POST /deck, GET /deck/id
// S2 => PATCH /deck/id

export const decksStub: Record<string, Deck> = {
  // full shuffled deck
  S1T1: {
    deckId: '4dd60fde-cee6-46e3-87e0-4a6fa3d091b7',
    type: DeckTypes.FULL,
    isShuffled: true,
    cards: cardsStub.S1T1,
    remaining: cardsStub.S1T1.length,
  },
  // full unshuffled deck
  S1T2: {
    deckId: '4dd60fde-cee6-46e3-87e0-4a6fa3d091b3',
    type: DeckTypes.FULL,
    isShuffled: false,
    cards: cardsStub.S1T2,
    remaining: cardsStub.S1T2.length,
  },
  // short shuffled deck
  S1T3: {
    deckId: '4dd60fde-cee6-46e3-87e0-4a6fa3d091b5',
    type: DeckTypes.SHORT,
    isShuffled: true,
    cards: cardsStub.S1T3,
    remaining: cardsStub.S1T3.length,
  },
  // short unshuffled deck
  S1T4: {
    deckId: '4dd60fde-cee6-46e3-87e0-4a6fa3d091b6',
    type: DeckTypes.SHORT,
    isShuffled: false,
    cards: cardsStub.S1T4,
    remaining: cardsStub.S1T4.length,
  },
  // empty deck
  S2T3: {
    deckId: '4dd60fde-cee6-46e3-87e0-4a6fa3d091b8',
    type: DeckTypes.FULL,
    isShuffled: true,
    cards: cardsStub.S2T3,
    remaining: cardsStub.S2T3.length,
  },
  // broken deck with duplicate cards
  S2T5: {
    deckId: '4dd60fde-cee6-46e3-87e0-4a6fa3d091b9',
    type: DeckTypes.FULL,
    isShuffled: true,
    cards: cardsStub.S2T5,
    remaining: cardsStub.S2T5.length,
  },
};
