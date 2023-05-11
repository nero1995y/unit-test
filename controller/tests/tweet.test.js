import faker from 'faker';
import {TweetController} from "../tweet.js";
import * as httpMocks from 'node-mocks-http';
import {fa} from "faker/lib/locales.js";


describe('TweetController', () => {
  let tweetController;
  let tweetsRepository;
  let mockedSocket;
  beforeEach(() => {
    tweetsRepository = {};
    mockedSocket = {emit: jest.fn()};
    tweetController = new TweetController(
      tweetsRepository,
      () => mockedSocket
    );
  });

  describe('getTweets',() => {
    it('returns all tweets when username is not provided', async () => {
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();
      const allTweets = [
        { text : faker.random.words(3)},
        { text : faker.random.words(3)}
      ];

      tweetsRepository.getAll = () => allTweets;

      await tweetController.getTweets(request, response);

      expect(response._getStatusCode()).toBe(200);
      expect(response._getJSONData()).toEqual(allTweets);
    });
  })
});