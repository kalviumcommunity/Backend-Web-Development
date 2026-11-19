'use strict';


require('dotenv').config();

const { Queue } = require('bullmq');

const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  tls: {},
};

const emailQueue = new Queue('email', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

module.exports = { emailQueue, connection };
