import { Injectable } from '@nestjs/common';

import { CreateDeckDto } from './Validation/create-deck.dto';
import { UpdateDeckDto } from './Validation/update-deck.dto';
import { IDeck } from './Types/deck';
import { ICard } from './Types/card';
import { DrawCardsDto } from './Validation/draw-cards.dto';
import { DeckRepository } from './deck.repository';
import DeckLogic from './deck.logic';
import {
  DeckNotFoundException,
  InternalServerException,
  InvalidDeckException,
  InvalidDrawException,
} from '../../Common/Errors';
import { hasDuplicates } from '../../Common/utils';

@Injectable()
export class DeckService {
  constructor(private readonly deckRepository: DeckRepository) {}

  public async create({ type, isShuffled }: CreateDeckDto): Promise<IDeck> {
    const cards = [...DeckLogic.generateDeck({ type })];
    if (isShuffled) DeckLogic.shuffle(cards);
    const deck = {
      type,
      isShuffled,
      cards,
      remaining: cards.length,
    };
    try {
      const newDeck = await this.deckRepository.create(deck);
      // todo: format to remove cards
      return newDeck;
    } catch (e) {
      throw new InternalServerException();
    }
  }

  findAll() {
    return `This action returns all deck`;
  }

  async findOne(_id: string): Promise<IDeck> {
    try {
      const deck = await this.deckRepository.findById(_id);
      return deck;
    } catch (e) {
      throw new DeckNotFoundException();
    }
  }

  async drawCards(_id: string, { count }: DrawCardsDto): Promise<ICard[]> {
    const deck: IDeck = await this.deckRepository.findById(_id);
    if (!deck) throw new DeckNotFoundException();
    if (deck.remaining < 1) return [];
    if (count > deck.remaining) throw new InvalidDrawException();
    const cardsDrawn = deck.cards.slice(0, count);
    if (hasDuplicates(cardsDrawn)) throw new InvalidDeckException();
    try {
      await this.deckRepository.findOneAndUpdate(
        { _id },
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

  update(id: string, updateDeckDto: UpdateDeckDto) {
    return `This action updates a #${id} deck`;
  }

  remove(id: number) {
    return `This action removes a #${id} deck`;
  }
}
