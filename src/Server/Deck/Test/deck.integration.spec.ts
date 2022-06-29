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
import { ERRORS } from '../../../Common/Errors/messages';

jest.setTimeout(60000);

describe('Deck Service - E2E', () => {
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
      await dbConnection.collection('decks').insertOne(decksStub.S1T1);
      const response = await request(httpServer).get(
        `/deck/${decksStub.S1T1.deckId}`,
      );
      // check if whether the entity was successfully stored in DB

      expect(response.status).toBe(HttpStatus.OK);
      response.body._id = undefined;
      // we can exclude _id from equality check because Mongo always returns an extraneous _id property
      expect(response.body).toMatchObject(decksStub.S1T1);
    });

    it("should respond with error if deck doesn't exist", async () => {
      await dbConnection.collection('decks').insertOne(decksStub.S1T1);
      const malformedId = 'malformed';
      const response = await request(httpServer).get(`/deck/${malformedId}`);
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual(ERRORS.DECK_NOT_FOUND);
    });
  });

  describe('POST decks/', () => {
    it('should create a full shuffled deck', async () => {
      const body: CreateDeckDto = {
        type: decksStub.S1T1.type,
        isShuffled: decksStub.S1T1.isShuffled,
      };
      const response = await request(httpServer).post('/deck').send(body);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject(body);

      const deck = await dbConnection.collection('decks').findOne(body);
      expect(deck).toMatchObject(response.body);
    });

    it('should create a full unshuffled deck', async () => {
      const body: CreateDeckDto = {
        type: decksStub.S1T2.type,
        isShuffled: decksStub.S1T2.isShuffled,
      };
      const response = await request(httpServer).post('/deck').send(body);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject(body);

      const deck = await dbConnection.collection('decks').findOne(body);
      expect(deck).toMatchObject(response.body);
    });

    it('should create a short shuffled deck', async () => {
      const body: CreateDeckDto = {
        type: decksStub.S1T3.type,
        isShuffled: decksStub.S1T3.isShuffled,
      };
      const response = await request(httpServer).post('/deck').send(body);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject(body);

      const deck = await dbConnection.collection('decks').findOne(body);
      expect(deck).toMatchObject(response.body);
    });

    it('should create a short unshuffled deck', async () => {
      const body: CreateDeckDto = {
        type: decksStub.S1T4.type,
        isShuffled: decksStub.S1T4.isShuffled,
      };
      const response = await request(httpServer).post('/deck').send(body);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject(body);

      const deck = await dbConnection.collection('decks').findOne(body);
      expect(deck).toMatchObject(response.body);
    });

    it('should throw a validation error due to malformed prop "type" in request body', async () => {
      const body = {
        type: 'malformed',
        isShuffled: decksStub.S1T1.isShuffled,
      };

      const expectedValidationError = [
        {
          target: {
            type: 'malformed',
            isShuffled: decksStub.S1T1.isShuffled,
          },
          value: 'malformed',
          property: 'type',
          children: [],
          constraints: {
            isEnum: 'type must be a valid enum value',
          },
        },
      ];
      const response = await request(httpServer).post('/deck').send(body);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toEqual(expectedValidationError);
    });

    it('should throw a validation error due to malformed prop "isShuffled" in request body', async () => {
      const body = {
        type: decksStub.S1T1.type,
        isShuffled: 'malformed',
      };

      const expectedValidationError = [
        {
          target: {
            type: decksStub.S1T1.type,
            isShuffled: 'malformed',
          },
          value: 'malformed',
          property: 'isShuffled',
          children: [],
          constraints: {
            isBoolean: 'isShuffled must be a boolean value',
          },
        },
      ];
      const response = await request(httpServer).post('/deck').send(body);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toEqual(expectedValidationError);
    });
  });

  describe('PATCH decks/:id', () => {
    it('should draw correct 3 cards from deck', async () => {
      await dbConnection.collection('decks').insertOne(decksStub.S1T1);
      const body: DrawCardsDto = {
        count: 3,
      };
      const response = await request(httpServer)
        .patch(`/deck/${decksStub.S1T1.deckId}`)
        .send(body);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject(cardsStub.S2T1);

      const alteredDeck = await dbConnection
        .collection('decks')
        .findOne({ deckId: decksStub.S1T1.deckId });

      const expected = {
        ...decksStub.S1T1,
        cards: decksStub.S1T1.cards.slice(body.count),
        remaining: decksStub.S1T1.remaining - body.count,
      };
      expect(alteredDeck).toMatchObject(expected);
    });

    it('should throw a validation error when prop "count" is missing', async () => {
      await dbConnection.collection('decks').insertOne(decksStub.S1T1);
      const body = {};
      const response = await request(httpServer)
        .patch(`/deck/${decksStub.S1T1.deckId}`)
        .send(body);

      const expectedValidationError = [
        {
          target: {},
          property: 'count',
          children: [],
          constraints: {
            max: 'count must not be greater than 52',
            min: 'count must not be less than 1',
            isInt: 'count must be an integer number',
          },
        },
      ];
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toEqual(expectedValidationError);
    });

    it('should throw a validation error when prop "count" exceeds maximum', async () => {
      await dbConnection.collection('decks').insertOne(decksStub.S1T1);
      const body: DrawCardsDto = { count: 56 };
      const response = await request(httpServer)
        .patch(`/deck/${decksStub.S1T1.deckId}`)
        .send(body);

      const expectedValidationError = [
        {
          children: [],
          constraints: {
            max: 'count must not be greater than 52',
          },
          property: 'count',
          target: {
            count: body.count,
          },
          value: body.count,
        },
      ];
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toEqual(expectedValidationError);
    });

    it('should throw an error that deck is empty', async () => {
      await dbConnection.collection('decks').insertOne(decksStub.S2T3);
      const body: DrawCardsDto = { count: 2 };
      const response = await request(httpServer)
        .patch(`/deck/${decksStub.S2T3.deckId}`)
        .send(body);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual(ERRORS.EMPTY_DECK);
    });

    it('should throw an error that user attempted to draw more cards than possible from deck', async () => {
      await dbConnection.collection('decks').insertOne(decksStub.S1T3);
      const body: DrawCardsDto = { count: 34 };
      const response = await request(httpServer)
        .patch(`/deck/${decksStub.S1T3.deckId}`)
        .send(body);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual(ERRORS.INVALID_DRAW);
    });
  });
});
