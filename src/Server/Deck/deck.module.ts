import { Module } from '@nestjs/common';
import { DeckService } from './deck.service';
import { DeckController } from './deck.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Deck, DeckSchema } from '../../Schemas/deck.schema';
import { DeckRepository } from './deck.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
  ],
  controllers: [DeckController],
  providers: [DeckService, DeckRepository],
})
export class DeckModule {}
