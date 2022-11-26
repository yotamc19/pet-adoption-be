require('dotenv').config();
const express = require("express");
const PORT = process.env.PORT || 8080;
const cors = require("cors");
const mongoose = require('mongoose');
const connectDb = require('./config/dbConnection');
const usersRoute = require('./routes/userRoute');
const petsRoute = require('./routes/petRoute');
const cookieParser = require('cookie-parser');
const pino = require('pino-http');
require('dotenv').config();
const app = express();

//global middlewares
app.use(express.json());
// app.use(pino({ level: process.env.LOG_LEVEL }));  //info / warn / error / silent
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use("/user", usersRoute);
app.use("/pet", petsRoute);

//connects to DB
connectDb();

//if connected ===> listen on PORT
mongoose.connection.once('open', () => {
    console.log('Connnected to MongoDb');
    app.listen(PORT, () => { console.log('Listening on port', PORT) })
})