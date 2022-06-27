import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { DeckTypes } from '../Types/deck';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeckDto {
  @IsDefined()
  @IsEnum(DeckTypes)
  @ApiProperty({
    enum: DeckTypes,
    enumName: 'deck type',
    example: DeckTypes.SHORT,
  })
  type: DeckTypes;

  @IsDefined()
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    name: 'isShuffled',
    description: 'choose to create a shuffled deck or not',
    example: true,
  })
  isShuffled?: boolean;
}
