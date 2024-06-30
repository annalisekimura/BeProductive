import React from 'react';
import '../App.css'; 
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRef, useEffect } from 'react';
import { useContext } from 'react';
import { EventContext } from './EventContext';
import Sidebar from '../Components/sidebar';
import App from '../App';
import { notifyUser } from '../App';

/* Month calendar */

function MonthPage() {
    const calendarRef = useRef(null);
    const {events, setEvents} = useContext(EventContext);

    /* Retrieve events from storage */

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('calendarEvents'));
        if (storedEvents) {
            setEvents(storedEvents)
        }
    }, [setEvents]);

    /* Notify if events are happening today */

    useEffect(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      events.forEach(event => {
        const newDate = new Date(event.start);
        if (today.getTime() === newDate.getTime()) {
          notifyUser(`${event.title}!`);
        }
      });
    }, []);


    /* Add new event to storage */

    const handleEventAdd = (event) => {
      const newEvents = [...events, event];
      setEvents(newEvents);
      localStorage.setItem('calendarEvents', JSON.stringify(newEvents));
    }

    /* Edit or delete event */

    const handleEventClick = (info) => {
      const event = info.event;
      const choice = prompt(`Do you want to edit or delete the event "${event.title}"?\nType 'Edit' or 'Delete'`);
    
      if (choice === 'Edit') {
        const newTitle = prompt('Enter the new title for the event:', event.title);
        if (newTitle) {
          event.setProp('title', newTitle);
          const updatedEvents = events.map(evt => evt.id === event.id ? {...evt, title: newTitle} : evt);
          setEvents(updatedEvents);
          localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
          alert('Event updated.');
        } else {
          alert('Event title cannot be empty.');
        }
      }
      else if (choice === 'Delete') {
        const updatedEvents = events.filter(evt => evt.id !== parseInt(event.id, 10));
        event.remove();
        setEvents(updatedEvents);
        localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
        alert('Event deleted.');
      }
    };

    const getRandomColor = () => {
      // Generate a random color
      const hue = Math.floor(Math.random() * 360); // Random hue
      const saturation = 0.8;
      const lightness = 0.5;
      return `hsl(${hue}, ${Math.floor(saturation * 100)}%, ${Math.floor(lightness * 100)}%)`;
    };

    const generateTaskColors = () => {
        let taskColors = JSON.parse(localStorage.getItem('taskColors')) || {};
        events.forEach(event => {
            // Generate a color for each task title
            if (!taskColors[event.title]) {
                taskColors[event.title] = getRandomColor();
            }
        });
        localStorage.setItem('taskColors', JSON.stringify(taskColors));
        return taskColors;
    };

    const eventContent = (arg) => {
        const taskColors = generateTaskColors();
        const color = taskColors[arg.event.title] || getRandomColor();
        return {
            html: `<div style="background-color: ${color};">${arg.event.title}</div>`
        };
    };

    
    return (
      <div className='Container'>
        <Sidebar />
        <div className="content">
          <h1>Month</h1>
            <Fullcalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"

              //click on date
              dateClick={function(info) {
                var date = info.dateStr
                console.log(info.dateStr);
                var title = prompt('Enter the event title:');
                var id = Date.now();
                const calendarApi = calendarRef.current.getApi()
                const newEvent = {
                    id: id,
                    title: title,
                    start: date,
                    allDay: true
                }
                calendarApi.addEvent(newEvent);
                handleEventAdd(newEvent);
            }}

              headerToolbar={{
                center: 'addEventButton'
              }}
              customButtons={{
                addEventButton: {
                  text: 'add event...',
                  click: function() {
                    var dateStr = prompt('Enter a date in YYYY-MM-DD format');
                    var date = new Date(dateStr + 'T00:00:00'); // will be in local time
                    if (!isNaN(date.valueOf())) { // valid?
                      var title = prompt('Enter the event title:');
                      var id = Date.now();
                      const calendarApi = calendarRef.current.getApi()
                      const newEvent = {
                        id: id,
                        title: title,
                        start: date,
                        allDay: true
                      }
                      calendarApi.addEvent(newEvent);
                      handleEventAdd(newEvent);
                    }
                    else {
                      alert('Invalid date.');
                    }
                  }
                }
              }}
              events={events}
              eventClick={handleEventClick}
              eventContent={eventContent}
              height="auto" // Set calendar height to full viewport height
              width="100%" // Set calendar width to 100% of parent container
            />
        </div>
      </div>
    );
}

export default MonthPage;


