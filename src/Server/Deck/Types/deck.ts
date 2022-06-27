import { ICard } from './card';
import { Deck } from '../../../Schemas/deck.schema';

export enum Suits {
  SPADES = 'SPADES',
  DIAMONDS = 'DIAMONDS',
  HEARTS = 'HEARTS',
  CLUBS = 'CLUBS',
}

export enum Court {
  JACK = 'JACK',
  QUEEN = 'QUEEN',
  KING = 'KING',
  ACE = 'ACE',
}

export enum DeckTypes {
  FULL = 'FULL',
  SHORT = 'SHORT',
}

export interface IDeck {
  deckId: string;
  type: DeckTypes;
  isShuffled: boolean;
  cards: ICard[];
  remaining: number;
}

export type TDeckPreview = Omit<Deck, 'cards'>;
