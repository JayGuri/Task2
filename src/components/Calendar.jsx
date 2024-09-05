import React, { useState, useEffect } from 'react';
import { format, getDaysInMonth, startOfMonth } from 'date-fns';
import EventModal from './EventModal';
import { fetchEvents } from '../api/api';

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const loadEvents = async () => {
            const holidays = await fetchEvents();
            const augustEvents = holidays.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getMonth() === 7 && eventDate.getFullYear() === 2019;
            }).map(event => ({
                id: event.name, // Using event name as ID (could be anything unique)
                date: event.date,
                title: event.name,
                isImported: true // Mark this event as imported
            }));
            
            const storedEvents = JSON.parse(localStorage.getItem('userEvents')) || [];
            setEvents([...augustEvents, ...storedEvents]);
        };

        loadEvents();
    }, []);

    useEffect(() => {
        const userEvents = events.filter(event => !event.isImported);
        localStorage.setItem('userEvents', JSON.stringify(userEvents));
    }, [events]);

    const daysInMonth = getDaysInMonth(new Date(2019, 7)); // August 2019
    const startDay = startOfMonth(new Date(2019, 7)).getDay();

    const handleDayClick = (day) => {
        setSelectedDate(day);
        setSelectedEvent(null);
        setModalOpen(true);
    };

    const handleEventClick = (event) => {
        if (!event.isImported) {
            setSelectedEvent(event);
            setModalOpen(true);
        }
    };

    const addEvent = (title) => {
        setEvents([...events, { id: title, date: selectedDate, title, isImported: false }]);
        setModalOpen(false);
    };

    const deleteEvent = (id) => {
        setEvents(events.filter(event => event.id !== id));
        setModalOpen(false);
    };

    return (
        <div className="App">
            <h1>August 2019</h1>
            <div className="calendar-grid">
                {[...Array(startDay).keys()].map((_, i) => <div key={i} className="day-of-week"></div>)}
                {[...Array(daysInMonth).keys()].map(day => {
                    const date = format(new Date(2019, 7, day + 1), 'yyyy-MM-dd');
                    const dayEvents = events.filter(event => event.date === date);
                    return (
                        <div key={day} onClick={() => handleDayClick(date)}>
                            <div>{day + 1}</div>
                            {dayEvents.map(event => (
                                <div 
                                    key={event.id} 
                                    onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}
                                    className={`event ${event.isImported ? 'imported' : 'manual'}`}
                                >
                                    {event.title}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
            {modalOpen && (
                <EventModal 
                    onClose={() => setModalOpen(false)} 
                    onSave={addEvent} 
                    onDelete={selectedEvent ? () => deleteEvent(selectedEvent.id) : null}
                    selectedEvent={selectedEvent}
                />
            )}
        </div>
    );
};

export default Calendar;
