import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  HttpServer,
  HttpStatus,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { Connection } from 'mongoose';
import * as request from 'supertest';

import { AppModule } from '../../../app.module';
import { DatabaseService } from '../../../Configurations/Database/database.service';
import { decksStub } from './Stubs/decks.stub';
import { CreateDeckDto } from '../Validation/create-deck.dto';
import { DrawCardsDto } from '../Validation/draw-cards.dto';
import { cardsStub } from './Stubs/cards.stub';

jest.setTimeout(60000);

describe('DeckController - E2E', () => {
  let dbConnection: Connection;
  let httpServer: HttpServer;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          return new BadRequestException(validationErrors);
        },
      }),
    );
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    httpServer = app.getHttpServer();
    await app.init();
  });

  beforeEach(async () => {
    await dbConnection.collection('decks').deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET decks/:id', () => {
    it('should successfully get a specific deck', async () => {
      await dbConnection.collection('decks').insertOne(decksStub.T1);
      const response = await request(httpServer).get(
        `/deck/${decksStub.T1.deckId}`,
      );
      // check if whether the entity was successfully stored in DB

      expect(response.status).toBe(HttpStatus.OK);
      response.body._id = undefined;
      // we can exclude _id from equality check because Mongo always returns an extraneous _id property
      expect(response.body).toMatchObject(decksStub.T1);
    });
  });

  describe('POST decks/', () => {
    it('should create a full shuffled deck', async () => {
      const body: CreateDeckDto = {
        type: decksStub.T1.type,
        isShuffled: decksStub.T1.isShuffled,
      };
      const response = await request(httpServer).post('/deck').send(body);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject(body);

      const deck = await dbConnection
        .collection('decks')
        .findOne({ type: decksStub.T1.type });
      expect(deck).toMatchObject(response.body);
    });
  });

  describe('PATCH decks/:id', () => {
    it('should draw correct 3 cards from deck', async () => {
      await dbConnection.collection('decks').insertOne(decksStub.T1);
      const body: DrawCardsDto = {
        count: 3,
      };
      const response = await request(httpServer)
        .patch(`/deck/${decksStub.T1.deckId}`)
        .send(body);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject(cardsStub.T4);

      const alteredDeck = await dbConnection
        .collection('decks')
        .findOne({ deckId: decksStub.T1.deckId });

      const expected = {
        ...decksStub.T1,
        cards: decksStub.T1.cards.slice(body.count),
        remaining: decksStub.T1.remaining - body.count,
      };
      expect(alteredDeck).toMatchObject(expected);
    });
  });
});
