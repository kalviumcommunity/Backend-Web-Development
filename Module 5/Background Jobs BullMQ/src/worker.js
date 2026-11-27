'use strict';

const { Worker } = require('bullmq');
const { connection } = require('./queue');
const { transporter } = require('./email');

// Create worker to process email jobs
const worker = new Worker(
  'email',
  async (job) => {
    if (job.name === 'otp') {
      const { to, otp } = job.data;

      // Send OTP verification email
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: 'Email Verification OTP',
        text: `Your verification OTP is ${otp}. It is valid for 10 minutes.`
      });

      console.log(`OTP email sent to ${to}`);
    } else {
      throw new Error(`Unknown job type: ${job.name}`);
    }
  },
  {
    connection
  }
);

// Log completed jobs
worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

// Log failed jobs
worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});

module.exports = { worker };