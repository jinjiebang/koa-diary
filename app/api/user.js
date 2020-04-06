const Router = require('koa-router')
const { RegisterValidator } = require('../validators/validator')
const { User } = require('../models/user')
const { success } = require('../lib/helper')
const router = new Router({
    prefix: '/user'
})

router.post('/register', RegisterValidator, async ctx => {
    const { email, nickname, password1 } = ctx.request.body
    const user = await User.findOne({
        where: {
            email
        }
    })
    if (user) {
        throw new EmailRepetition()
    }
    await User.create({ email, nickname, password: password1 })
    success()
})

router.post('/login', async ctx => {
    const { email, password } = ctx.request.body
    const user = await User.validatorEmail(email, password)
    ctx.body = {
        user
    }
})

module.exports = router