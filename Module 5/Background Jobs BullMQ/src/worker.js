'use strict';

const { Worker } = require('bullmq');

const { connection } = require('./queue');
const { transporter } = require('./email');

const emailWorker = new Worker('email', async (job) => {
  if (job.name === 'otp') {
    const { to, otp } = job.data;
    await transporter.sendMail({
      to,
      subject: 'Your OTP Verification Code',
      text: `Your OTP is: ${otp}`
    });
  }
}, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  }
});

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} [${job.name}] completed successfully.`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} [${job.name}] failed with error: ${err.message}`);
});

module.exports = emailWorker;