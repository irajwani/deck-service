import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  Res,
  HttpCode,
} from '@nestjs/common';
import { DeckService } from './deck.service';
import { CreateDeckDto } from './Validation/create-deck.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { DrawCardsDto } from './Validation/draw-cards.dto';

@ApiTags('Deck')
@Controller('deck')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDeckDto: CreateDeckDto,
    @Res() response?: Response,
  ) {
    const deck = await this.deckService.create(createDeckDto);
    return response.status(HttpStatus.CREATED).json(deck);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') deckId: string) {
    return this.deckService.findOne(deckId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  drawCards(@Param('id') id: string, @Body() drawCardsDto: DrawCardsDto) {
    return this.deckService.drawCards(id, drawCardsDto);
  }
}
