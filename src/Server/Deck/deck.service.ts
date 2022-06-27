import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Deck } from '../../Schemas/deck.schema';
import { ICard } from './Types/card';
import { DeckRepository } from './deck.repository';
import { CreateDeckDto } from './Validation/create-deck.dto';

import { DrawCardsDto } from './Validation/draw-cards.dto';
import DeckLogic from './deck.logic';
import {
  DeckNotFoundException,
  InternalServerException,
  InvalidDeckException,
  InvalidDrawException,
} from '../../Common/Errors';
import { hasDuplicates } from '../../Common/utils';
import { TDeckPreview } from './Types/deck';
import { formatDeckForPreview } from '../../Common/Formatters/deck';

@Injectable()
export class DeckService {
  constructor(private readonly deckRepository: DeckRepository) {}

  public async create({
    type,
    isShuffled,
  }: CreateDeckDto): Promise<TDeckPreview> {
    const cards = [...DeckLogic.generateDeck({ type })];
    if (isShuffled) DeckLogic.shuffle(cards);
    const deck: Deck = {
      deckId: uuidv4(),
      type,
      isShuffled,
      cards,
      remaining: cards.length,
    };
    try {
      const newDeck = await this.deckRepository.create(deck);
      const formattedDeck = formatDeckForPreview(newDeck);
      return formattedDeck;
    } catch (e) {
      throw new InternalServerException();
    }
  }

  async findOne(deckId: string): Promise<Deck> {
    try {
      const deck = await this.deckRepository.findOne({ deckId });
      return deck;
    } catch (e) {
      throw new DeckNotFoundException();
    }
  }

  async drawCards(deckId: string, { count }: DrawCardsDto): Promise<ICard[]> {
    const deck: Deck = await this.deckRepository.findOne({ deckId });
    if (!deck) throw new DeckNotFoundException();
    if (deck.remaining < 1) return [];
    if (count > deck.remaining) throw new InvalidDrawException();
    const cardsDrawn = deck.cards.slice(0, count);
    if (hasDuplicates(cardsDrawn)) throw new InvalidDeckException();
    try {
      await this.deckRepository.findOneAndUpdate(
        { deckId },
        {
          $push: {
            cards: {
              $each: [],
              $slice: count - deck.remaining,
            },
          },
          remaining: deck.remaining - count,
        },
      );
      return cardsDrawn;
    } catch (e) {
      throw new InternalServerException();
    }
  }
}
