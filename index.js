const express = require('express')
const app = express()
const port = 3000
const { User } = require('./models/User')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jwkang827:Dil8MyZ5nAEBMN2m@boilerplate.tpyn8.mongodb.net/')
    .then(() => console.log('MongDB Connected!')).catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res) => {

    const user = new User(req.body)

    user.save()
        .then(() => res.status(200).json({ success: true }))
        .catch((err) => res.json({ success: false, err }))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
