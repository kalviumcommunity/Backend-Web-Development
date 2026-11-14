
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
        from: process.env.SMTP_USER,
        to,
        subject: 'Email Verification OTP',
        text: `Your OTP for email verification is: ${otp}. It is valid for 10 minutes.`,
        html: `<p>Your OTP for email verification is: <strong>${otp}</strong></p>
               <p>It is valid for 10 minutes.</p>`,
      });

      console.log(`OTP email sent successfully to ${to}`);
    }
  },
  {
    connection,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});

module.exports = worker;
