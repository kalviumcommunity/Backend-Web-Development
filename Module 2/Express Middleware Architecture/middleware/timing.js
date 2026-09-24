function timing(req, res, next) {

    const start = Date.now();

    res.on("finish", () => {

        const duration = Date.now() - start;

        const id = req.id
            ? `[${req.id.substring(0, 8)}]`
            : "";

        console.log(
            `${id} ${req.method} ${req.path} took ${duration}ms`
        );

    });

    next();
}

module.exports = timing;