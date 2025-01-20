const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        maxlength: 200
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function (next) {
    var user = this

    if (user.isModified('password')) {
        // 비밀번호를 암호화
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hashedpw) {
                if (err) return next(err)
                user.password = hashedpw
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function (cb) {
    var user = this

    // jsonwebtoken을 이용해 token을 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save()
        .then(user => {
            cb(null, user);
        })
        .catch(err => {
            cb(err);
        });
}

userSchema.statics.findByToken = function (token, cb) {
    var user = this

    // 토큰을 디코드
    jwt.verify(token, 'secretToken', function (err, decoded) {
        // 디코드된 결과인 유저 아이디를 이용해서 유저를 찾은 뒤
        // 클라이언트에서 가져온 토큰과 DB에 보관된 토큰을 비교

        user.findOne({ "_id": decoded, "token": token })
            .then(user => {
                cb(null, user);
            })
            .catch(err => {
                cb(err);
            });
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }