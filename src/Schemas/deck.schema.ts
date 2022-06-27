import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DeckTypes } from '../Server/Deck/Types/deck';
import { ICard } from '../Server/Deck/Types/card';

@Schema({ timestamps: true })
export class Deck {
  @Prop({ unique: true })
  deckId: string;

  @Prop({ enum: DeckTypes, required: true })
  type: DeckTypes;

  @Prop({ required: true })
  isShuffled: boolean;

  @Prop()
  remaining: number;

  @Prop()
  cards: ICard[];
}

export type DeckDocument = Deck & Document;
export const DeckSchema = SchemaFactory.createForClass(Deck);
