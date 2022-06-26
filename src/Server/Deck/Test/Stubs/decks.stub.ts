import { DeckTypes, IDeck } from '../../Types/deck';
import { cardsStub } from './cards.stub';

export const decksStub: Record<string, IDeck> = {
  // full shuffled deck
  T1: {
    _id: '61eaaf49be5a795b3050071561eaaf49be5a795b30500715',
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
