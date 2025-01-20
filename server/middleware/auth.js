const { User } = require('../models/User')

let auth = (req, res, next) => {
    // 인증 처리를 하는 곳

    // 클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth

    // 토큰을 복호화 한 후 유저를 찾음
    User.findByToken(token, (err, user) => {
        if(err) throw err
        if(!user) return res.json({ isAuth: false, error: true })

        req.token = token // index.js에서 req.token으로 토큰값에 접근 가능해짐
        req.user = user
        next()
    })
}

module.exports = { auth }