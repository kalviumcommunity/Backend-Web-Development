export function errorMiddleware(err, req, res, next) {
    console.error("Unexpected server error");

    return res.status(500).json({
        error: {
            code: "INTERNAL_ERROR",
            message: "Internal server error"
        }
    });
}