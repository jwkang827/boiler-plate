const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const { auth } = require('./middleware/auth')
const { User } = require('./models/User')

const config = require('./config/key')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongDB Connected!')).catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/hello', (req, res) => res.send('Hello axios!'))

app.post('/api/users/register', (req, res) => {

    const user = new User(req.body)

    user.save()
        .then(() => res.status(200).json({ success: true }))
        .catch((err) => res.json({ success: false, err }))
})

app.post('/users/login', (req, res) => {
    // 요청된 이메일을 데이터베이스 찾기
    User.findOne({ email: req.body.email })
        .then(docs => {
            if (!docs) {
                return res.json({
                    loginSuccess: false,
                    messsage: "제공된 이메일에 해당하는 유저가 없습니다."
                })
            }
            docs.comparePassword(req.body.password, (err, isMatch) => {
                if (!isMatch) return res.json({ loginSuccess: false, messsage: "비밀번호가 틀렸습니다." })
                // Password가 일치하다면 토큰 생성
                docs.generateToken((err, user) => {
                    if (err) return res.status(400).send(err);
                    // 토큰을 저장
                    res.cookie("x_auth", user.token)
                        .status(200)
                        .json({ loginSuccess: true, userId: user._id })
                })
            })
        })
        .catch((err) => {
            return res.status(400).send(err);
        })
})

app.get('/api/users/auth', auth, (req, res) => {
    // auth 미들웨어를 통과했다는 것은 Authentication이 True라는 말
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true, // 0은 일반유저 아니면 관리자
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastnmae: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
        .then(user => {
            res.status(200).send({
                success: true
            })
        })
        .catch(err => {
            res.json({ success: false, err })
        })
})

const port = 5000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
