import { Court, DeckTypes, Suits } from '../Types/deck';
import { ICard } from '../Types/card';
import Constants from '../../../Common/constants';

export default class Deck {
  cards: ICard[];

  constructor(type: DeckTypes, isShuffled: boolean) {
    this.generateDeck(type, isShuffled);
  }

  private generateDeck(type: DeckTypes, isShuffled): void {
    const iterableCards = {
      suits: [Suits.SPADES, Suits.HEARTS, Suits.DIAMONDS, Suits.CLUBS],
      court: [Court.JACK, Court.QUEEN, Court.KING, Court.ACE],
      [Symbol.iterator]: function* () {
        const startAt =
          type === DeckTypes.FULL
            ? Constants.FULL_DECK_START
            : Constants.SHORT_DECK_START;

        for (const suit of this.suits) {
          for (let i = startAt; i <= 10; i++)
            yield { value: i, suit, code: i + suit.charAt(0) };
          for (const c of this.court)
            yield { value: c, suit, code: c.charAt(0) + suit.charAt(0) };
        }
      },
    };
    this.cards = [...iterableCards];
    if (isShuffled) this.shuffle(this.cards);
  }

  private shuffle(cards: ICard[]): void {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }
}
