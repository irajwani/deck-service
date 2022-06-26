import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model as MongooseModel } from 'mongoose';
import { Deck, DeckDocument } from '../../Schemas/deck.schema';
import { EntityRepository } from '../../Configurations/Database/abstractEntityReposistory';

@Injectable()
export class DeckRepository extends EntityRepository<DeckDocument> {
  constructor(@InjectModel(Deck.name) deckModel: MongooseModel<DeckDocument>) {
    super(deckModel);
  }
}
