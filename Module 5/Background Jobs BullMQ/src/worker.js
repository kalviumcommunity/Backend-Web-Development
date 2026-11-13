'use strict';

const { Worker } = require('bullmq');
const nodemailer = require('nodemailer');
const { connection } = require('./queue');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: Number(process.env.SMTP_PORT || 1025),
    secure: process.env.SMTP_SECURE === 'true',
    auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            }
            : undefined,
});

const worker = new Worker(
    'email',
    async (job) => {
        if (job.name === 'otp') {
            const { email, otp } = job.data;

            if (!email || !otp) {
                throw new Error('OTP job requires email and otp');
            }

            await transporter.sendMail({
                from: process.env.EMAIL_FROM || 'no-reply@example.com',
                to: email,
                subject: 'Your verification code',
                text: `Your verification code is ${otp}. It expires in 10 minutes.`,
            });

            return { sent: true, email };
        }

        throw new Error(`Unsupported email job: ${job.name}`);
    },
    {
        connection,
        settings: {
            backoffStrategy: (attemptsMade) => 1000 * 2 ** (attemptsMade - 1),
        },
    },
);

worker.on('completed', (job) => {
    console.log(`Email job ${job.id} completed`);
});

worker.on('failed', (job, error) => {
    console.error(`Email job ${job?.id} failed: ${error.message}`);
});

module.exports = { worker, transporter };