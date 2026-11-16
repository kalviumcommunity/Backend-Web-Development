
'use strict';

const { Worker } = require('bullmq');
const { connection } = require('./queue');
const { transporter } = require('./email');

const worker = new Worker(
  'email',
  async (job) => {
    if (job.name === 'otp') {
      const { email, otp } = job.data;

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Email Verification OTP',
        text: `Your OTP is ${otp}. It expires in 10 minutes.`
      });
    }
  },
  {
    connection
  }
);

worker.on('completed', (job) => {
  console.log('completed', job.id);
});

worker.on('failed', (job, error) => {
  console.log('failed', job?.id, error.message);
});

module.exports = worker;
