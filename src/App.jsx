import { useState, useEffect } from 'react'
import Note from './compontents/Note'
import PropTypes from 'prop-types'
import noteService from './Service/notes'
import Notification from './compontents/Notification'
import Footer from './compontents/Footer'

// START SERVER: json-server --port 3001 --watch db.json


const App = () => {

const [notes, setNotes] = useState([])
const [newNote, setNewNote] = useState('')
const [showAll, setShowAll] = useState(true)
const [errorMessage, setErrorMessage] = useState(null)

useEffect(() => {
  noteService
    .getAll()
    .then(initialNotes => {
      console.log('promise fulfilled')
      setNotes(initialNotes)
    })
}, [])


const addNote = (event) => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    important: Math.random() < 0.5,
  }

  noteService
    .create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })

}

const handleNoteChange = (event) => {
  setNewNote(event.target.value)
}

const notesToShow = showAll ? notes : notes.filter(note => note.important === true)

const toggleImportanceOf = id => {
  const note = notes.find(note => note.id === id)
  const changedNote = { ...note, important: !note.important}

  noteService
    .update(id, changedNote)
    .then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note :
         returnedNote))
  })
  // eslint-disable-next-line no-unused-vars
  .catch(error => {
      setErrorMessage(
        `Note '${note.content}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })
}


  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          Show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
      {notesToShow.map(note =>
        <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
        )}  
      </ul>
      <form onSubmit={addNote}>
        <input 
          placeholder='Write a note...'
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">Save Note</button>
      </form>   
      <Footer />

    </div>
  )
}

App.propTypes = {
  notes: PropTypes.array
}

export default App
