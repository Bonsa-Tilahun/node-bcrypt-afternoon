const express = require('express')
const session = require('express-session')
const massive = require('massive')
require('dotenv').config()

const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')

//middlewares
const auth = require('./middlewares/authMiddleware')

const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

const app = express()
app.use(express.json())
app.use(session({
    resave: true,
    saveUninitialized: false,
    // cookie: 1000000,
    secret: SESSION_SECRET
}))

massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
}).then(dbInstance => {
    app.set('db', dbInstance)
    console.log("DB Connected")
    app.listen(SERVER_PORT, () => console.log(`Server up and running on ${SERVER_PORT}`))
})

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.logIn)
app.get('/auth/logout', authCtrl.logout)

//Treasure endpoints
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);