const Dash = require('dash');

const clientOpts = {
  network: 'testnet',
  mnemonic:
    'uniform analyst paper father soldier toe lesson fetch exhaust jazz swim response',
};
const client = new Dash.Client(clientOpts);

const registerContract = async function () {
  try {
    await client.isReady();
    const platform = client.platform;
    const identity = await platform.identities.get(
      'CheZBPQHztvLNqN67i4KxcTU1XmDz7qG85X1XeJbc7K5',
    );

    const contractDocuments = {
      tweet: {
        properties: {
          username: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
          date: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    };
    const contract = await platform.contracts.create(
      contractDocuments,
      identity,
    );
    console.dir({ contract });

    // Make sure contract passes validation checks
    await platform.dpp.dataContract.validate(contract);

    // Sign and submit the data contract
    await platform.contracts.broadcast(contract, identity);
  } catch (e) {
    console.error('Something went wrong:', e);
  } finally {
    client.disconnect();
  }
};

registerContract();
