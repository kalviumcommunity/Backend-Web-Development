'use strict';

const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
});

const emailQueue = new Queue('email', {
    connection,
});

module.exports = { emailQueue, connection };