const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/users')
//const { request, response } = require('express')

usersRouter.post('/',(request,response)=>{
    const {username,name,password} = request.body
    const saltRounds = 10
    let passwordHash
    bcrypt.hash(password, saltRounds)
    .then((result)=>{
      passwordHash=result
    })

    const new_user = new User({
        username : username,
        name : name,
        passwordHash : passwordHash
    })

    new_user.save()
    .then((posted_user)=>{
        response.status(201).json(posted_user)
    })
    .catch((error)=>{
        response.status(400).json({error : error.name})
    })

})

usersRouter.get('/',(request,response)=>{
    User.find({}).populate('notes',{ content: 1, important: 1 })
    .then((result)=>{
        response.json(result)
    })
})

module.exports = usersRouter