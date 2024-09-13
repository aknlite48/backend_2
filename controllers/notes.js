const notesRouter = require('express').Router()
const Note = require('../models/notes')
const User = require('../models/users')

notesRouter.post('/',async (request,response)=>{
    const body = request.body
    const user = await User.findById(body.userId)

    const note = new Note(
        {
            content: body.content,
            important: body.important,
            user: user.id
        }
    )

    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.status(201).json(savedNote)
})

notesRouter.get('/',(request,response)=>{
    Note.find({}).populate('user',{username:1,name:1})
    .then((result)=>{
      response.json(result)
    })
})



module.exports = notesRouter