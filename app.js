const express = require('express')
const dotenv = require('dotenv').config()
const mongodb = require("./config/db")
const userRoutes = require("./routes/userRoute")
const cookieParser = require('cookie-parser')
const app = express();
app.use(express.json())
app.use (express.urlencoded ({ extended: true }))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.set("view engine", "ejs")
app.use("/", userRoutes)



mongodb()
const port = process.env.port;
app.listen(port)