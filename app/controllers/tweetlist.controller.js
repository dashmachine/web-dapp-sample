const debug = require('debug')('server:debug');
const DashConnection = require('../services/dashConnection.service');
const DashUser = require('../models/dashUser.model');
const TweetDocument = require('../models/tweetDocument.model');

// TODO: move vendor details to .env
const vendorMnemonic =
  'erosion chalk panda one embrace absurd punch fitness congress cave true fine';
const vendorIdentityId =
  '6st5GyAzz1jZuLbroUk3JWR8H1mzscZ3TcVjCKViGcPh';

// TODO: move contract id to .env
const TweetContractId =
  '7zU12eKXC7P8mnPQVA8W9cDk5UBLnMePmKshQQJJYeBn';

// TODO: dontl realy need to pass the auth options
const Options = require('../config/options');

/**
 *  return a list of tweets from registered users
 *  i.e. only those submitted by the vendor (document ownerId = vendor identity Id
 *  [and where username is on the list of registered users]
 *
 */
exports.tweetlist = async (req, res, next) => {
  try {
    debug(`getting tweets list`);

    const tweetQuery = {
      //startAt: 1,
      orderBy: [['temp_timestamp', 'desc']],
      where: [['$ownerId', '==', vendorIdentityId]],
      limit: 10,
    };
    const forUsername = req.params.name;
    debug(`req.params.user: ${forUsername}`);
    if (forUsername !== undefined) {
      tweetQuery.where[1] = ['username', '==', forUsername];
    }

    const tweetConnection = new DashConnection(
      'testnet',
      'uniform analyst paper father soldier toe lesson fetch exhaust jazz swim response',
      Options.options.connection.apps,
      Options.options.connection.seeds,
    );
    await tweetConnection.connect();
    const tweetsFound = await TweetDocument.find(
      tweetConnection,
      'tweetContract.tweet',
      tweetQuery,
    );
    tweetConnection.disconnect();
    debug(`found tweets: ${tweetsFound}`);
    return res.status(200).json({ success: tweetsFound });
  } catch (e) {
    debug(`error finding tweets: ${e}`);
    return res.status(400).json({ error: e });
  }
};
