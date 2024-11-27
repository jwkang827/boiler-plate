const express = require('express')
const app = express()
const port = 5000
const { User } = require('./models/User')

const config = require('./config/key')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongDB Connected!')).catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res) => {

    const user = new User(req.body)

    user.save()
        .then(() => res.status(200).json({ success: true }))
        .catch((err) => res.json({ success: false, err }))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
