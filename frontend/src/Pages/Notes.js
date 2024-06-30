import React, { useEffect } from "react";
import CreateNote from "./CreateNote";
import { useState } from "react";
import './notes.css';
import {v4 as uuid} from 'uuid';
import '../App.css'; 
import Sidebar from "../Components/sidebar";

/* Sticky notes page */

function Notes() {
    const [inputText, setInputText] = useState("");

    const [notes, setNotes] = useState(() => {
        return JSON.parse(localStorage.getItem("Notes")) || []
    });

    const [editToggle, setEditToggle] = useState(null);

    /* Edit note */

    const editHandler = (id, text) => {
        setEditToggle(id);
        setInputText(text);

    }

    /* Save changes on notes */

    const saveHandler = () => {
        if(editToggle) {
            setNotes(notes.map((note) => (
                note.id === editToggle ?
                {...note, text: inputText}
                : note
            )))
        }
        else {
            setNotes((prevNotes) => [
                ...prevNotes, {
                    id: uuid(),
                    text: inputText
                }
            ])
        }
        setInputText("");
        setEditToggle(null);
    }

    /* Delete a note */

    const deleteHandler = (id) => {
        const newNotes = notes.filter(n => n.id !== id);
        setNotes(newNotes);
    }

    /* Set notes from storage */

    useEffect(() => {
        window.localStorage.setItem("Notes", JSON.stringify(notes))
    }, [notes])

    return (
        <div className="container3">
            <Sidebar />
            <div className="content">

                <div className='typeNote'>
                    <CreateNote
                        inputText={inputText}
                        setInputText={setInputText}
                        saveHandler={saveHandler}
                    />
                </div>
                
                <div className='notes'>
                    {notes.map((note) => (
                        <div className="note" key={note.id}>
                            <textarea
                                value={note.text}
                                readOnly={!editToggle || editToggle !== note.id}
                            />
                            <div className="note_footer">
                                <div className="note_actions">
                                    <button className="note_save" onClick={() => editHandler(note.id, note.text)}>
                                        Edit
                                    </button>
                                    <button className="note_save" onClick={() => deleteHandler(note.id)}>
                                        Delete
                                    </button>
                                </div>
                                <div className="note_date">
                                    {new Date().toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Notes;