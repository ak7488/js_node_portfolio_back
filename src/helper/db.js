const {MongoClient, GridFSBucket} = require('mongodb');

const client = new MongoClient(process.env.ATLUS_URL).connect();

module.exports = {
    client,
    GridFSBucket
}