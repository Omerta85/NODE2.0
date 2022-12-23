const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const fileUpload = require('express-fileupload');
const swaggerUI = require('swagger-ui-express');
const mongoose = require('mongoose');
require('dotenv').config()

const userRouter = require('./router/user.router');
const authRouter = require('./router/auth.router');
const configs = require('./config/config');
const { cronRunner } = require('./cron');
const swaggerJson = require('./swagger.json');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

app.use(fileUpload());

const io = socketIO(server, {cors: 'http://localhost:63342'});
io.on('connection', (socket) =>{

    socket.on('disconnect',()=>{
        console.log(`Socket ${socket.id} was disconected`)
    });
    // console.log(socket.id);
    //
    // console.log(socket.handshake.auth);
    // console.log(socket.handshake.query.page);

    socket.on('message:send', (messageData)=>{
        console.log(messageData.text);

        //Send One to One
        //socket.emit('message:new', messageData.text);

        //Send event to all except emiter
        //socket.broadcast.emit('message:new', messageData.text);

        //send event to all clients
        io.emit('message:new', messageData.text);


    })

    socket.on('room:join', (roomInfo) => {
        socket.join(roomInfo.roomId); //socket join room
        //socket.leave(roomInfo.roomId); //socket leave room

        //send to all in room except new member
        //socket.to(roomInfo.roomId).emit('user:room:join', socket.id);

        //send to all room members
        io.to(roomInfo.roomId).emit('user:room:join', socket.id);



    })

})



app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJson));

app.get('/', (req, res) => {
    res.json('WELOCME')
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'Unknown error',
        status: err.status || 500
    });
});

server.listen(configs.PORT, async () => {
    await mongoose.connect('mongodb://127.0.0.1/june2022');
    console.log(`Server listen ${configs.PORT}`);
    // cronRunner();
});