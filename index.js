const express = require('express')
const app = express()

app.use(express.json()) //converts json of request body to js object

const cors = require('cors')

app.use(cors())
//app.use(express.static('dist'))

let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: false
    }
  ]
const get_new_id = ()=>{
  return (notes.length>0) ? 1+(Math.max(...notes.map((n)=>{return Number(n.id)}))) : 0
}
  app.post('/api/notes', (request, response) => {
    const body = request.body
    if (!body.content) {
      console.log('content missing')
      return response.status(400).json({error:'content missing'})
    }

    const note = {
      id: get_new_id().toString(),
      content: body.content,
      important: Boolean(body.important),
    }

    notes = notes.concat(note)
    console.log(note)
    response.json(note)
    
  })

app.get('/',(request,response)=>{
  response.send('<h1>Welcome page</h1>')
})

app.get('/api/notes',(request,response)=>{
  response.json(notes)
})

app.get('/api/notes/:id',(request,response)=>{
  const id = request.params.id
  console.log(response)
  const note = notes.find((n)=>{return n.id===id})
  if (note) {
    response.json(note)
  }
  else {
    response.status(404).end()
  }
  
})

app.put('/api/notes/:id',(request,response)=>{
  const id = request.params.id
  const body = request.body
  const note = {
    id: body.id,
    content: body.content,
    important: body.important
  }
  notes = notes.map((n)=>{
    if (n.id===id) {
      return note
    }
    else {
      return n
    }
  })
  response.json(note)

})

app.delete('/api/notes/:id',(request,response)=>{
  const id = request.params.id
  notes = notes.filter((n)=>{return n.id!==id})
  //response.json(request)
  response.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})