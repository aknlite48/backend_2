import { useState,useEffect } from "react";
import axios from 'axios'

//change when going from dev to prod

//const base_url = "http://localhost:3001/api/notes"
const base_url = "/api/notes"


const App = (props) => {

  const [notes,setNotes] = useState([])
  const [newnote,setNewNote] = useState('a new note')
  const [to_sort,set_sort] = useState(0)
  const [isImp,setImp] = useState(false)

  const hook = () => {
    //console.log('effect')
    axios
      .get(base_url)
      .then(response => {
        //console.log('promise fulfilled')
        setNotes(response.data)
      })
      .catch(response=>{
        console.log("server load failed")
      })
  }
  
  useEffect(hook, [])

  const addNote = (event)=>{
    event.preventDefault()
    const newnote1 = {
      id:(notes.length+1),
      content: newnote,
      important: Math.random() < 0.5
    }
    axios
    .post(base_url,newnote1)
    .then(response=>{
      //console.log("connection")
      setNotes(notes.concat(response.data))
      setNewNote('')
    })
    .catch(response=>{
      //console.log('No connection')
      setNewNote('')
    })
  }

  const deleteNote = (id)=>{
    axios
    .delete(`${base_url}/${id}`)
    .then(()=>{
      //alert(`Deleted ${response.body.content}`)
      //console.log(response)
      setNotes(notes.filter((n)=>{return n.id!==id}))
    })
    .catch(()=>{
      console.log("Delete failed")
    })
  }

  const changeImp = (id) => {
    let c_note = notes.find((n)=>{return n.id===id})
    c_note.important = c_note.important ? false : true
    axios
    .put(`${base_url}/${id}`,c_note)
    .then(response=>{
      setNotes(notes.map((n)=>{
        if (n.id===id) {
          return response.data
        }
        else {
          return n
        }
      }))
    })
    .catch(()=>{
      console.log('priority update failed')
    })
  }

  const onchangefun = (event)=>{
    //console.log(event.target.value)
    setNewNote(event.target.value)
  }
  
  
  const To_rend = () =>{
    let rf1
    if (to_sort===0) {
      rf1 = notes
    }
    else if (to_sort===1) {
      rf1 = notes.toSorted((a,b)=>{
        let x = a.content
        let y = b.content
        if (x<y) {
          return -1
        }
        if (x>y) {
          return 1
        }
        return 0
      })
    }
    else if (to_sort===2) {
      rf1 = notes.toSorted((a,b)=>{
        let x = a.content
        let y = b.content
        if (x<y) {
          return 1
        }
        if (x>y) {
          return -1
        }
        return 0
      })
    }
    
    let rf2 = isImp ? rf1.filter((n)=>{return n.important}) : rf1
    return (
      
        <ul>
        {rf2.map((note)=> {return <li key={note.id}>{note.content} <button onClick={()=>{changeImp(note.id)}}>{note.important?'U':'I'}</button><button onClick={()=>{deleteNote(note.id)}}>X</button></li>})}
        </ul>
      
    )
  }
  
  const sort_display = ['↑','↓','-']


  


  return (
    <div>
      <h1 id='jtop'>Notes</h1> 
      <button onClick={()=>{if (isImp) {setImp(false)} else {setImp(true)}}}>Show Imp</button>
      <button id='jtop' onClick={()=>{if (to_sort===0) {set_sort(1)} if (to_sort===1) {set_sort(2)} if (to_sort===2) {set_sort(0)}}}>{sort_display[to_sort]}</button>


      <To_rend />


      <form onSubmit={addNote}>
        <input value={newnote} onChange={onchangefun}/>
        <button type="submit">save</button>
      </form> 



    </div>
  )
}


export default App;