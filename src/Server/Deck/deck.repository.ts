import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model as MongooseModel } from 'mongoose';
import { IDeck, DeckDocument } from '../../Schemas/deck.schema';
import { EntityRepository } from '../../Configurations/Database/abstract-entity-repository';

@Injectable()
export class DeckRepository extends EntityRepository<DeckDocument> {
  constructor(@InjectModel(IDeck.name) deckModel: MongooseModel<DeckDocument>) {
    super(deckModel);
  }
}
