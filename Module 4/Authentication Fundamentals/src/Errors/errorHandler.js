function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }

    // Handle invalid JSON sent in a request.
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid JSON in request body',
            },
        });
    }

    // Handle known application errors.
    if (error.isOperational) {
        return res.status(error.statusCode).json({
            error: {
                code: error.code,
                message: error.message,
            },
        });
    }

    // Handle duplicate email errors from Prisma safely.
    if (error.code === 'P2002') {
        return res.status(409).json({
            error: {
                code: 'EMAIL_ALREADY_EXISTS',
                message: 'Email is already registered',
            },
        });
    }

    // Do not expose internal error details to the client.
    console.error('An unexpected server error occurred.');

    return res.status(500).json({
        error: {
            code: 'INTERNAL_ERROR',
            message: 'Internal server error',
        },
    });
}

module.exports = errorHandler;