
'use strict';

const { Worker } = require('bullmq');
const { connection } = require('./queue');
const { transporter } = require('./email');

// Worker processes jobs from the email queue
const worker = new Worker(
  'email',
  async (job) => {
    if (job.name === 'otp') {
      await transporter.sendMail({
        from: process.env.SMTP_USER || 'no-reply@example.com',
        to: job.data.to,
        subject: 'Your Email Verification OTP',
        text: `Your verification code is ${job.data.otp}. It expires in 10 minutes.`,
      });
    }
  },
  {
    connection,
  }
);

// Log successful jobs
worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

// Log failed jobs
worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});

module.exports = { worker };
