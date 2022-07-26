import { Test, TestingModule } from '@nestjs/testing';
import { DeckController } from '../deck.controller';
import { DeckService } from '../deck.service';
import { CreateDeckDto } from '../Validation/create-deck.dto';
import { decksStub } from './Stubs/decks.stub';
import mockResponse from './Helpers/mockResponse';
import { Response } from 'express';
import { DrawCardsDto } from '../Validation/draw-cards.dto';
import { cardsStub } from './Stubs/cards.stub';

const MockResponse = mockResponse as unknown as Response;

jest.mock('../deck.service');

describe('DeckController', () => {
  let controller: DeckController;
  let service: DeckService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [DeckController],
      providers: [DeckService],
    }).compile();

    controller = moduleRef.get<DeckController>(DeckController);
    service = moduleRef.get<DeckService>(DeckService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /, Create a deck', () => {
    it('should create a full shuffled deck', async () => {
      const body: CreateDeckDto = {
        type: decksStub.S1T1.type,
        isShuffled: decksStub.S1T1.isShuffled,
      };
      const result = await controller.create(body, MockResponse);
      expect(service.create).toHaveBeenCalledWith(body);
      expect(result).toEqual(decksStub.S1T1);
    });
  });

  describe('GET /:id, Get a deck by _id', () => {
    it('should get the right deck', async () => {
      const _id = decksStub.S1T1._id;
      const result = await controller.findOne(_id);
      expect(service.findOne).toHaveBeenCalledWith(_id);
      expect(result).toEqual(decksStub.S1T1);
    });
  });

  describe('PATCH /:id, Draw cards from deck', () => {
    it('should successfully draw top 3 cards from specific deck', async () => {
      const _id = decksStub.S1T1._id;
      const body: DrawCardsDto = { count: 3 };
      const result = await controller.drawCards(_id, body);
      expect(service.drawCards).toHaveBeenCalledWith(_id, body);
      expect(result).toEqual(cardsStub.S2T1);
    });
  });
});
