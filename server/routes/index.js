const express = require('express')
const db = require('../db')
const router = express.Router()
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'z%C*F-JaNdRgUkXn2r5u8x/A?D(G+KbP'



router.get('/getallusers', async (req, res, next) => {
    const reqToken = req.headers['x-auth-token']
    if (reqToken !== undefined) {
        jwt.verify(reqToken, SECRET_KEY, (err, authData) => {
            if (err) {
                res.sendStatus(403)
            } else {
                res.json({
                    message: 'Post created...',
                    authData
                })
            }
        })
    } else {
        res.sendStatus(403)
    }
})

router.get('/login', async (req, res, next) => {
    const requestedParams = ['email', 'password'];
    let user = { email: req.body.email, password: req.body.password }

    if (areAllParametersCompleted(requestedParams, user)) {
        try {
            let responseUser = await db.login(user)
            signAndResponse(user, res, responseUser);
        } catch (e) {
            console.log(e)
            res.sendStatus(e)
        }
    } else {
        res.json({ error: true, code: 400, message: generateRequestParametersMessage(requestedParams), user: {} })
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        let results = await db.one(req.params.id)
        res.json(results);
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})


function signAndResponse(user, res, responseUser) {
    jwt.sign({ user }, SECRET_KEY, { expiresIn: '1d' }, (err, token) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                error: false, code: 200, message: "OK", user: responseUser, token: token
            });
        }
    });
}

function areAllParametersCompleted(requiredParamsList, user) {
    let areAllParametersCompleted = true

    if (Object.keys(user).length === 0) {
        areAllParametersCompleted = false
    } else {
        requiredParamsList.forEach(element => {
            if (!user[element]) {
                areAllParametersCompleted = false
            }
        })

        return areAllParametersCompleted
    }
}

function generateRequestParametersMessage(requiredParamsList) {
    let response = "los parametros "

    requiredParamsList.forEach(element => {
        response += element + ","
    })

    response = response.substring(0, response.length - 1)

    response += "deben estar completados o no ser nulos"

    return response
}


module.exports = router;

