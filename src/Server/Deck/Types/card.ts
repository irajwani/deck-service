import { Suits } from './deck';

export interface ICard {
  value: string | number;
  suit: Suits;
  code: string;
}
