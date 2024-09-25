const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jwkang827:Dil8MyZ5nAEBMN2m@boilerplate.tpyn8.mongodb.net/')
.then(() => console.log('MongDB Connected!')).catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// 