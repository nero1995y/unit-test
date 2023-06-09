import * as tweetRepository from '../data/tweet.js';
import {getSocketIO} from '../connection/socket.js';

export class TweetController {
  constructor(tweetRepository, getSocket) {
    this.tweets = tweetRepository;
    this.getSocket = getSocket;
  }

  getTweets = async (req, res) => {
    const username = req.query.username;
    const data = await (username
      ? this.tweets.getAllByUsername(username)
      : this.tweets.getAll());
    res.status(200).json(data);
  }

  getTweet = async (req, res, next) => {
    const id = req.params.id;
    const tweet = await tweetRepository.getById(id);
    if (tweet) {
      res.status(200).json(tweet);
    } else {
      res.status(404).json({message: `Tweet id(${id}) not found`});
    }
  }

  createTweet = async (req, res, next) => {
    const {text} = req.body;
    const tweet = await tweetRepository.create(text, req.userId);
    res.status(201).json(tweet);
    this.getSocket().emit('tweets', tweet);
  }

  updateTweet = async (req, res, next) => {
    const id = req.params.id;
    const text = req.body.text;
    const tweet = await tweetRepository.getById(id);
    if (!tweet) {
      return res.status(404).json({message: `Tweet not found: ${id}`});
    }
    if (tweet.userId !== req.userId) {
      return res.sendStatus(403);
    }
    const updated = await tweetRepository.update(id, text);
    res.status(200).json(updated);
  }

  deleteTweet = async (req, res, next) => {
    const id = req.params.id;
    const tweet = await tweetRepository.getById(id);
    if (!tweet) {
      return res.status(404).json({message: `Tweet not found: ${id}`});
    }
    if (tweet.userId !== req.userId) {
      return res.sendStatus(403);
    }
    await tweetRepository.remove(id);
    res.sendStatus(204);
  }

}

