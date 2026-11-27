
'use strict';

const { Worker } = require('bullmq');
const { connection } = require('./queue');
const { transporter } = require('./email');

// Worker takes jobs from the 'email' queue and processes them.
const worker = new Worker(
  'email',
  async (job) => {
    if (job.name === 'otp') {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: job.data.to,
        subject: 'Your verification code',
        text: `Your OTP is ${job.data.otp}`,
      });

      // Returning means the job completed successfully.
      return;
    }

    // Unknown job types should fail and be retried.
    throw new Error(`Unknown job type: ${job.name}`);
  },
  {
    connection,

    // Also include the retry settings required by the assignment.
    // The Queue's defaultJobOptions in queue.js applies them to jobs.
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    },
  }
);

// Log successful jobs.
worker.on('completed', (job) => {
  console.log(`job ${job.id} completed`);
});

// Log failed jobs.
worker.on('failed', (job, err) => {
  console.error(`job ${job ? job.id : 'unknown'} failed: ${err.message}`);
});

module.exports = { worker };
