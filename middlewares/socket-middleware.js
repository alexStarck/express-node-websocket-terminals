const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function (socket, next) {
    try {
        if (socket?.handshake?.auth?.token) {
            const user=tokenService.validateAccessToken(socket.handshake.auth.token.split(' ')[1])
            socket.user=user
           return  next();
        } else {
            socket.disconnect()
            return next(ApiError.UnauthorizedError())
        }
        // const user=tokenService.validateAccessToken(socket.handshake)

    } catch (e) {
        socket.disconnect()
        return next(ApiError.UnauthorizedError());
    }
};
