const sqlite3 = require('sqlite3').verbose()
const Promise = require('bluebird')

function dao() {

    let db = new sqlite3.Database(':memory:', (err) => {
        if (err) {
            console.log(err.message)
        } else {
            console.log('Database Connect')
        }
    })

    const run = (sql = '', params = []) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, (err) => {
                if (err) {
                    console.log('Error running sql ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve({ id: this.lastId })
                }
            })
        })
    }

    const get = (sql = '', params = []) => {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, result) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

    const all = (sql = '', params = []) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    return {
        run, get, all
    }
}


module.exports = dao