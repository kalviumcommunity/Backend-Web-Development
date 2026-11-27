'use strict';

const { Worker } = require('bullmq');
const { connection } = require('./queue');
const { transporter } = require('./email');

const worker = new Worker(
  'email',
  async (job) => {
    if (job.name === 'otp') {
      const { to, otp } = job.data;

      await transporter.sendMail({
        from: process.env.SMTP_USER || 'no-reply@example.com',
        to,
        subject: 'Email Verification OTP',
        text: `Your email verification OTP is ${otp}. It is valid for 10 minutes.`,
      });

      return { success: true };
    }

    throw new Error(`Unknown job type: ${job.name}`);
  },
  {
    connection,
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

module.exports = worker;