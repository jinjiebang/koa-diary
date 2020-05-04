const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const catchError = require('./middlewares/expection')
const cors = require('koa2-cors')
const InitManager = require('./core/init')

const app = new Koa()

app.use(cors())
app.use(catchError)
app.use(bodyParser())
InitManager.initCore(app);
app.listen(3001)
console.log('listen 3000')