import React from 'react';
import '../App.css'; 
import './week.css'
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {Draggable} from "@fullcalendar/interaction";
import { useContext } from 'react';
import { WeekContext } from './WeekContext';
import { EventContext } from './EventContext';
import { useRef, useEffect } from 'react';
import Confetti from "react-confetti"
import myImage from './FinishBucket.png';
import { useState } from 'react';
import Sidebar from '../Components/sidebar';



function WeekPage() {
    const calendarRef = useRef(null);
    const {events2, setEvents2} = useContext(WeekContext);
    const {events} = useContext(EventContext);
    const [confetti, setConfetti] = useState(false);
    const [importantEventsThisWeek, setImportantEventsThisWeek] = useState([]);
    const [leftPos, setLeftPos] = useState('');
    const [rightPos, setRightPos] = useState('');
    const [upPos, setUpPos] = useState('');
    const [downPos, setDownPos] = useState('');

    // Get stored events to display
    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('calendarEventsWeek'));
        if (storedEvents) {
            setEvents2(storedEvents)
        }
    }, [setEvents2]);

    const clearAllEvents = () => {
        setEvents2([]);
        localStorage.setItem('calendarEventsWeek', JSON.stringify([]));
        const calendarApi = calendarRef.current.getApi();
        calendarApi.removeAllEvents();
    };

    // Get finish line image
    useEffect(() => {
        let containerEl = document.getElementById('image-container')
        new Draggable(containerEl, {
            itemSelector: '.finishLine'
          });
        }, []);

    useEffect(() => {
        if (calendarRef.current) {
            filterEventsForCurrentWeek();
        }
    }, [events, calendarRef.current]);  
    

    // Add an event
    const handleEventAdd = (event) => {
        const newEvents = [...events2, event];
        setEvents2(newEvents);
        localStorage.setItem('calendarEventsWeek', JSON.stringify(newEvents));
    }
    
    // Delete event when finished
    const handleEventDrop = (eventId) => {
        const updatedEvents = events2.filter(evt => evt.id !== parseInt(eventId, 10));
        setEvents2(updatedEvents);
        localStorage.setItem('calendarEventsWeek', JSON.stringify(updatedEvents));

         // Render confetti
         setConfetti(true);
         setTimeout(() => setConfetti(false), 3000);
    };

    // Update calendar when drag event
    const handleEventDropOrResize = (info) => {
        const event = info.event;
        const updatedEvents = events2.map(evt => evt.id === parseInt(event.id, 10) ? {
            ...evt,
            start: event.start.toISOString()
        } : evt);
        setEvents2(updatedEvents);
        localStorage.setItem('calendarEventsWeek', JSON.stringify(updatedEvents));
    };



    // Delete or edit event when clicked
    const handleEventClick = (info) => {
        const event = info.event;
        const choice = prompt(`Do you want to edit or delete the event "${event.title}"?\nType 'Edit' or 'Delete'`);
    
        if (choice === 'Edit') {
          const newTitle = prompt('Enter the new title for the event:', event.title);
          if (newTitle) {
            event.setProp('title', newTitle);
            const updatedEvents = events2.map(evt => evt.id === event.id ? {...evt, title: newTitle} : evt);
            setEvents2(updatedEvents);
            localStorage.setItem('calendarEventsWeek', JSON.stringify(updatedEvents));
          }
        } else if (choice === 'Delete') {
          const updatedEvents = events2.filter(evt => evt.id !== parseInt(event.id, 10));
          event.remove();
          setEvents2(updatedEvents);
          localStorage.setItem('calendarEventsWeek', JSON.stringify(updatedEvents));
          alert('Event deleted. Now, update your database...');
        }
    };

    const filterEventsForCurrentWeek = () => {
        const calendarApi = calendarRef.current.getApi();
        const currentStart = calendarApi.view.currentStart;
        const currentEnd = calendarApi.view.currentEnd;
        const currentUser = localStorage.getItem('user');


        const filteredEvents = events.filter(event => {
            const eventDate = new Date(event.start);
            console.log(eventDate);
            console.log(event.id);
            return eventDate >= currentStart && eventDate < currentEnd && event.userId === currentUser;
        });

        setImportantEventsThisWeek(filteredEvents);

    }


    useEffect (() => {
        const imageElement = document.querySelector('.finishLine');
        if (imageElement) {
            // Get the position relative to the viewport
            const imagePosition = imageElement.getBoundingClientRect();
 
            setLeftPos(imagePosition.left);
            setRightPos(imagePosition.right);
            setDownPos(imagePosition.bottom);
            setUpPos(imagePosition.top);
        }

    }, [])

    const currentUser = localStorage.getItem('user');
    const filteredEvents1 = events2.filter(event => event.userId === currentUser);

    
    return (
        <div className="container">
            <Sidebar />
            <div className='content2'>
                <div className="weekly-calendar">
                    <h1>Week</h1>

                    {/* Display calendar */}
                    <Fullcalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        dateClick={function(info) {
                            var date = info.dateStr
                            var title = prompt('Enter the event title:');
                            var id = Date.now();
                            const calendarApi = calendarRef.current.getApi()
                            const newEvent = {
                                id: id,
                                title: title,
                                start: date,
                                allDay: false,
                                userId: currentUser
                            }
                            calendarApi.addEvent(newEvent);
                            handleEventAdd(newEvent);
                        }}

                        //header buttons
                        headerToolbar={{
                            center: 'addEventButton',
                        }}
                        customButtons={{
                            addEventButton: {
                                text: 'add event...',
                                click: function() {
                                    var dateStr = prompt('Enter a date in YYYY-MM-DD format');
                                    var timeStr = prompt('Enter a time in T00:00:00 format')
                                    var date = new Date(dateStr + timeStr); // local time
                        
                                    if (!isNaN(date.valueOf())) {
                                        var title = prompt('Enter the event title:');
                                        var id = Date.now();
                                        const calendarApi = calendarRef.current.getApi()
                                        const newEvent = {
                                                id: id,
                                                title: title,
                                                start: date,
                                                allDay: false,
                                                userId: currentUser
                                        }
                                        calendarApi.addEvent(newEvent);
                                        handleEventAdd(newEvent);
                                    } else {
                                        alert('Invalid date.');
                                    }
                                }
                            }
                        }}
                        events={filteredEvents1}
                        eventClick={handleEventClick}
                        editable={true}
                        eventResizableFromStart={true}
                        droppable={true}
                        eventDidMount={(info) => {
                            const eventEl = info.el;
                            eventEl.setAttribute('draggable', true);
                            eventEl.addEventListener('dragstart', (e) => {
                                e.dataTransfer.setData('text/plain', info.event.id);
                            });
                        }}
                        eventDragStop={(info) => {
                            const jsEvent = info.jsEvent;

                            if (leftPos <= jsEvent.pageX && jsEvent.pageX <= (rightPos + 20) && (upPos - 20) <= jsEvent.pageY && jsEvent.pageY <= (downPos + 20)) {
                                handleEventDrop(info.event.id);
                            }
                        }}
                        eventResize={(info) => {
                            const event = info.event;
                            const updatedEvents = events2.map(evt => evt.id === parseInt(event.id, 10) ? {
                                ...evt,
                                start: event.start.toISOString(),
                                end: event.end.toISOString()
                            } : evt);
                            setEvents2(updatedEvents);
                            localStorage.setItem('calendarEventsWeek', JSON.stringify(updatedEvents));
                        }}
                        eventDrop={handleEventDropOrResize} //save event when dropped
                        height="auto" // Set calendar height to full viewport height
                        width="100%" // Set calendar width to 100% of parent container
                    />
                </div>

                {/* Finish line image, droppable */}
                <div id="image-container">
                    <img
                        className="finishLine"
                        src={myImage}
                        alt="Finish Line"
                        draggable="true"
                        onDrop={(e) => {
                            e.preventDefault();
                            const eventId = e.dataTransfer.getData('text/plain');
                            handleEventDrop(eventId);
                            
                        }}
                        onDragOver={(e) => e.preventDefault()}
            

                    />
                    
                </div>
                
                {/* Render confetti if true */}    
                {confetti && <Confetti />}

                {/* List of events in month calendar */}
                <div className="event-list">
                    <h2>Important Dates</h2>
                        <ul id="lists">
                            {importantEventsThisWeek.map((event, index) => (
                                <li key={index}>
                                    {event.title} - {new Date(event.start).toLocaleDateString()}
                                </li>
                            ))}
                        </ul>
                </div>
            </div>
        </div>
    );
}

export default WeekPage;