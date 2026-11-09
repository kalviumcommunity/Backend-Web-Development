'use strict';

const { Worker } = require('bullmq');
const { connection } = require('./queue');
const transporter = require('./email');

const worker = new Worker(
  'email',
  async (job) => {
    if (job.name === 'otp') {
      await transporter.sendMail({
        to: job.data.to,
        subject: 'Your OTP Verification Code',
        text: `Your OTP is ${job.data.otp}. It is valid for 10 minutes.`,
      });
    }
  },
  {
    connection,
    settings: {
      backoffStrategy: (attemptsMade) => 1000 * Math.pow(2, attemptsMade - 1),
    },
  }
);

// Log completed jobs
worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

// Log failed jobs
worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});

module.exports = worker;