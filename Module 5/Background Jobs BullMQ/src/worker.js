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
                to: email,
                subject: 'Your OTP Verification Code',
                text: `Your OTP is ${otp}. Please do not share it with anyone.`,
            });
        }
    },
    {
        connection,
        settings: {
            backoffStrategy: undefined,
        },
    }
);

worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
});

module.exports = worker;