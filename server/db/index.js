const mysql = require('mysql')
const passwordHash = require('password-hash');



/* const pool = mysql.createPool({
    connectionLimit: 10,
    password: '',
    user: 'root',
    database: 'my_app',
    host: 'localhost',
    port: '3306'
}) */

const pool = mysql.createPool({
    connectionLimit: 10,
    password: 'a43dc3a7',
    user: 'b9967eb595fd75',
    database: 'heroku_8924fb6452c955f',
    host: 'us-cdbr-east-02.cleardb.com',
    port: '3306'
})

let userdb = {};

userdb.all = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM users`, (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })

};

userdb.one = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM users WHERE id=?`, [id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })

};


userdb.login = (user) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM users WHERE email = ?`, [user.email], (err, results) => {
            if (err) {
                return reject(err)
            }

            if (results.find(_user => passwordHash.verify(user.password, _user.password))) {
                return resolve(results[0])
            } else {
                return resolve({ error: true, message: '204 - No Content', user: {} })
            }
        })
    })

};

module.exports = userdb