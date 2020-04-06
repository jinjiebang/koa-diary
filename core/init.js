const Router = require('koa-router')
const Directory = require('require-directory')

class InitManager {
    static initCore(app) {
        InitManager.app = app
        InitManager.initLoadRoutes()
        InitManager.initLoadConfig()
    }
    static initLoadRoutes() {
        function checkRouter(obj) {
            if (obj instanceof Router) {
                InitManager.app.use(obj.routes())
            }
        }
        const path = process.cwd()
        Directory(module, `${path}/app/api`, { visit: checkRouter })
    }
    static initLoadConfig() {
        const path = process.cwd() + '/config/config.js'
        global.config = require(path)
    }
}

module.exports = InitManager