function logger(req, res, next) {

    res.on("finish", () => {

        const id = req.id
            ? `[${req.id.substring(0, 8)}]`
            : "";

        console.log(
            `${id} ${req.method} ${req.path} ${res.statusCode}`
        );

    });

    next();
}

module.exports = logger;