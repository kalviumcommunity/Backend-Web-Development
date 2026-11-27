
'use strict';

const { Queue } = require('bullmq');

// Redis connection settings
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT || 6379),
};

// Create the email queue.
// Jobs will retry up to 3 times with exponential backoff.
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
