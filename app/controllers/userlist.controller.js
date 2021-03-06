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
exports.userlist = async (req, res, next) => {
  try {
    debug(`getting signed up user list`);

    const userQuery = {
      orderBy: [['temp_timestamp', 'desc']],
      where: [['$ownerId', '==', vendorIdentityId]],
      limit: 10,
    };

    const userlistConnection = new DashConnection(
      'testnet',
      'uniform analyst paper father soldier toe lesson fetch exhaust jazz swim response',
      Options.options.connection.apps,
      Options.options.connection.seeds,
    );
    await userlistConnection.connect();
    const usersFound = await TweetDocument.find(
      userlistConnection,
      'tweetContract.signups',
      userQuery,
    );
    userlistConnection.disconnect();
    debug(`found signed up users: ${usersFound}`);
    return res.status(200).json({ success: usersFound });
  } catch (e) {
    debug(`error finding signed up users: ${e}`);
    return res.status(400).json({ error: e });
  }
};
