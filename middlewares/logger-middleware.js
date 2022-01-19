const moment = require('moment')
const fs = require('fs')
const path = require('path')
const tokenService = require('../service/token-service');

module.exports = function (req, res, next) {
    try {
        let obj = {};
        // console.log(next)
        // console.log(req.method)
        // if(req.method==='OPTIONS'){
        //     console.log(req.method)
        //     next()
        // }
        // if(req.cookies.refreshToken){
        //     const userData = tokenService.validateRefreshToken(req.cookies.refreshToken);
        //     console.log(userData)
        // }
        // if (req.ws) {
        //     // console.log('ws')
        //     // console.log(req.method,' ',req.url,' ',req.headers.authorization)
        //     const userData = tokenService.validateRefreshToken(req.cookies.refreshToken);
        //     obj = {
        //         method: req.method,
        //         protocol: req.protocol,
        //         url: req.url,
        //         from: req.headers.origin,
        //         user: userData,
        //         date: moment().format(),
        //         body: req.body
        //     }
        //     // console.log(obj)
        // } else {
        //     // console.log('http')
        //     // console.log(req.method,' ',req.url,' ',req.headers.authorization)


        //
        // }
        if (req.url === '/api/refresh' || req.method === 'OPTIONS') {
            return next();
        }

        const logPost = async (req) => {
            let userData = {}

            if (req.cookies) {
                userData = tokenService.validateRefreshToken(req.cookies.refreshToken);

            }
            // console.log({
            //     method: req.method,
            //     protocol: req.protocol,
            //     url: req.url,
            //     from: req.headers.origin,
            //     user: userData,
            //     date: moment().format(),
            //     body: req.body,
            //     params: req.params,
            //     query: req.query,
            // })

        }


        logPost(req)
        return next()
    } catch (e) {
        return next();
    }
};
