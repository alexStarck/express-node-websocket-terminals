require('dotenv').config()
const redisClient = require('./db/redis')
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const userRouter = require('./router/user-router')
const authRouter = require('./router/auth-router')
const terminalRouter = require('./router/terminal-router')
const errorMiddleware = require('./middlewares/error-middleware');
const loggerMiddleware = require('./middlewares/logger-middleware')
const socketMiddleware = require('./middlewares/socket-middleware')

const http = require('http')
const PORT = process.env.PORT || 5000;


const socketio = require('socket.io')


const onlineClients = new Set();


let updateInterval;
let updateTerminals;
let terminalsInterval;

function onNewWebsocketConnection(socket) {
    console.info(`Socket ${socket.id} has connected.`);
    onlineClients.add(socket.id);


    socket.on("disconnect", () => {
        onlineClients.delete(socket.id);
        console.info(`Socket ${socket.id} has disconnected.`);
    });


}

async function startServer() {
    const app = express()
    const path = require("path")
    // const favicon = require("serve-favicon")
    // const engine = require("consolidate")
    const server = http.createServer(app)
    const io = socketio(server, {
        cors: {
            credentials: true,
            origin: process.env.CLIENT_URL
        }
    });


    //middlewares
    app.use(express.json());
    app.use(cookieParser());
    app.use(loggerMiddleware);
    app.use(cors({
        credentials: true,
        origin: process.env.CLIENT_URL
    }));
    io.use(socketMiddleware)
    // io.use((socket, next) => {
    //
    //     console.log('websocket middleware')
    //     if (socket?.handshake?.auth?.token) {
    //         console.log('tut')
    //         next()
    //     } else {
    //         console.log('error')
    //         const err = new Error('not authorized')
    //         err.data = {message: "Please retry later"}
    //         next(err)
    //     }
    //
    //
    // })

    //routes
    app.use('/api', authRouter);
    app.use('/api', userRouter);
    app.use('/api', terminalRouter);


    //подключаем самым последним
    app.use(errorMiddleware);

    await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    })

    const db = await mongoose.connection

    io.on("connection", onNewWebsocketConnection);


    server.listen(PORT, () => {
        console.log(`Toilet App  is listening on port ${PORT}!`);
    });

    // broadcast here

    // setInterval(() => {
    //     io.emit("online_clients", Array.from(onlineClients));
    // }, 10000);

    updateTerminals=setInterval(async () => {
        redisClient.select(0)
        const allTerminals = await redisClient.KEYS("single:*")
        allTerminals.map(async(item)=>{
            const info=JSON.parse(await redisClient.GET(item))
            io.emit(item.split(':')[1], info);
        })

        // io.emit("online_terminals", array);

    }, 10000)

    terminalsInterval = setInterval(async () => {
        redisClient.select(0)
        const onlineTerminals = JSON.parse(await redisClient.GET("online"))
        const array = onlineTerminals.array.map((obj) => {
            return obj.name
        })
        io.emit("online_terminals", array);
    }, 10000)
}

startServer();