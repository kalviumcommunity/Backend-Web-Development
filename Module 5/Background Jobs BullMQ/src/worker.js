const { Worker } = require('bullmq');
const { connection } = require('./queue');
const email = require('./email');

const transporter = email.transporter || email;

const emailWorker = new Worker(
  'email',
  async (job) => {
    if (job.name === 'otp') {
      const { email: toEmail, to, otp, code } = job.data;
      const recipient = toEmail || to;
      const otpCode = otp || code;

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"Auth Service" <no-reply@example.com>',
        to: recipient,
        subject: 'Your Verification Code',
        text: `Your OTP is: ${otpCode}`,
        html: `<p>Your OTP is: <b>${otpCode}</b></p>`
      });
    }
    return { success: true };
  },
  {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000
      }
    }
  }
);

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`Job ${job ? job.id : 'unknown'} failed: ${err.message}`);
});

module.exports = emailWorker;
module.exports.emailWorker = emailWorker;
module.exports.worker = emailWorker;