export const errorMiddleware = (err, req, res, next) => {
    const { statusCode, message } = err || (500 && "Internal Server Error");
    return res.status(statusCode).json({ message: message });
}