import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { Deck } from '../../Schemas/deck.schema';
import { ICard } from './Types/card';
import { DeckRepository } from './deck.repository';
import { CreateDeckDto } from './Validation/create-deck.dto';

import { DrawCardsDto } from './Validation/draw-cards.dto';
import DeckLogic from './deck.logic';
import {
  DeckExistsException,
  DeckNotFoundException,
  EmptyDeckException,
  InternalServerException,
  InvalidDrawException,
  MongooseErrorCodes,
} from '../../Common/Errors';
import { TDeckPreview } from './Types/deck';
import { formatDeckForPreview } from '../../Common/Formatters/deck';
import { DatabaseService } from '../../Configurations/Database/database.service';
import { Connection } from 'mongoose';

@Injectable()
export class DeckService {
  constructor(
    private readonly deckRepository: DeckRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  private readonly dbConnection: Connection =
    this.databaseService.getDbHandle();

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
    } catch (err) {
      console.log(err);
      if (err.code === MongooseErrorCodes.UniquePropViolation) {
        throw new DeckExistsException();
      }
      throw new InternalServerException();
    }
  }

  async findOne(deckId: string): Promise<Deck> {
    const deck = await this.deckRepository.findOne({ deckId });
    if (!deck) throw new DeckNotFoundException();
    return deck;
  }

  async drawCards(deckId: string, { count }: DrawCardsDto): Promise<ICard[]> {
    const session = await this.dbConnection.startSession();
    session.startTransaction();
    try {
      const deck: Deck = await this.deckRepository.findOne({ deckId });
      if (!deck) throw new DeckNotFoundException();
      if (deck.remaining < 1) throw new EmptyDeckException();
      if (count > deck.remaining) throw new InvalidDrawException();
      const cardsDrawn = _.slice(deck.cards, 0, count);

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
      await session.commitTransaction();
      return cardsDrawn;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }
}
