'use strict';
// ─── YOUR FILE, implement this ────────────────────────────────────────────────
// Create a BullMQ Worker that processes jobs from the 'email' queue.
//
// Requirements:
//  1. Handle job.name === 'otp': send an email with the OTP using transporter.
//  2. Configure retries: attempts: 3, backoff: { type: 'exponential', delay: 1000 }
//  3. Log worker.on('completed') and worker.on('failed') events.
//  4. Throwing inside the worker function → job fails → BullMQ retries.
//     Returning without throwing → job completed.
require('dotenv').config();
const { Worker } = require('bullmq');
const { transporter } = require('./email');
const { connection } = require('./queue');

const worker = new Worker(
  'email',
  async (job) => {
    if (job.name === 'otp') {
      await transporter.sendMail({
        from: process.env.SMTP_USER || 'no-reply@example.com',
        to: job.data.to,
        subject: 'Your verification code',
        text: `Your OTP is ${job.data.otp}. It expires in 10 minutes.`,
      });
    }
    // returning without throwing = job completed
    // throwing an error = job failed → will be retried
  },
  {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
    },
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} (${job.name}) completed.`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} (${job?.name}) failed: ${err.message}`);
});

module.exports = worker;
