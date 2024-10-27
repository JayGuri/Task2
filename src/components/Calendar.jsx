import React, { useState, useEffect } from 'react';
import { format, getDaysInMonth, startOfMonth, addMonths, subMonths, isBefore, startOfDay } from 'date-fns';
import EventModal from './EventModal';
import TaskModal from './TaskModal';
import TimerEndModal from './TimerEndModal';
import { fetchEvents } from '../api/api';
import './Calendar.css';

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedTask, setSelectedTask] = useState(null);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [showTimerEndModal, setShowTimerEndModal] = useState(false);
    const [completedTask, setCompletedTask] = useState(null);

    useEffect(() => {
        const loadEvents = async () => {
            const holidays = await fetchEvents();
            const yearlessEvents = holidays.map(event => {
                const eventDate = new Date(event.date);
                return {
                    id: event.name,
                    date: format(eventDate, 'MM-dd'),
                    title: event.name,
                    isImported: true
                };
            });

            const storedEvents = JSON.parse(localStorage.getItem('userEvents')) || [];
            const convertedStoredEvents = storedEvents.map(event => ({
                ...event,
                date: event.date.slice(5)
            }));

            setEvents([...yearlessEvents, ...convertedStoredEvents]);
        };

        loadEvents();
    }, []);

    useEffect(() => {
        const userEvents = events.filter(event => !event.isImported);
        localStorage.setItem('userEvents', JSON.stringify(userEvents));
    }, [events]);

    useEffect(() => {
        let timer;
        if (isTimerRunning && selectedTask) {
            timer = setInterval(() => {
                setTasks(tasks => tasks.map(task => {
                    if (task.id === selectedTask.id) {
                        const newTimeRemaining = task.timeRemaining - 1;
                        console.log(`Timer for task "${task.title}": ${formatTime(newTimeRemaining)}`);
                        if (newTimeRemaining <= 0) {
                            setIsTimerRunning(false);
                            setCompletedTask(task);
                            setShowTimerEndModal(true);
                            console.log(`Timer ended for task "${task.title}"`);
                            return null; // This task will be filtered out
                        }
                        return { ...task, timeRemaining: newTimeRemaining };
                    }
                    return task;
                }).filter(Boolean)); // Remove null tasks
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isTimerRunning, selectedTask]);

    const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const handleDayClick = (date) => {
        setSelectedDate(date);
        setSelectedEvent(null);
        setShowActionModal(true);
    };

    const handleEventClick = (event, e) => {
        e.stopPropagation();
        if (!event.isImported) {
            setSelectedEvent(event);
            setModalOpen(true);
        }
    };

    const addEvent = (title) => {
        const monthDay = selectedDate.slice(5);
        setEvents([...events, { id: title, date: monthDay, title, isImported: false }]);
        setModalOpen(false);
    };

    const deleteEvent = (id) => {
        setEvents(events.filter(event => event.id !== id));
        setModalOpen(false);
    };

    const addTask = (title, duration) => {
        const taskId = `${title}-${new Date().getTime()}`;
        const task = { id: taskId, title, date: selectedDate, duration, timeRemaining: duration * 60, completed: false };
        setTasks([...tasks, task]);
        setTaskModalOpen(false);
        console.log(`New task added: "${title}" with duration ${duration} minutes`);
    };

    const handleTaskClick = (task, e) => {
        e.stopPropagation();
        setSelectedTask(task);
        console.log(`Selected task: "${task.title}" with ${formatTime(task.timeRemaining)} remaining`);
    };

    const handleStartTimer = () => {
        setIsTimerRunning(true);
        console.log(`Timer started for task "${selectedTask.title}"`);
    };

    const handlePauseTimer = () => {
        setIsTimerRunning(false);
        console.log(`Timer paused for task "${selectedTask.title}" at ${formatTime(selectedTask.timeRemaining)}`);
    };

    const handleResetTimer = () => {
        setTasks(tasks => tasks.map(task =>
            task.id === selectedTask.id
                ? { ...task, timeRemaining: task.duration * 60 }
                : task
        ));
        setIsTimerRunning(false);
        console.log(`Timer reset for task "${selectedTask.title}" to ${formatTime(selectedTask.duration * 60)}`);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleEndTask = () => {
        setTasks(tasks => tasks.filter(task => task.id !== completedTask.id));
        setShowTimerEndModal(false);
        setSelectedTask(null);
        console.log(`Task "${completedTask.title}" completed and removed`);
    };

    const getEventsForDate = (fullDate) => {
        const monthDay = format(new Date(fullDate), 'MM-dd');
        return events.filter(event => event.date === monthDay);
    };

    const getTasksForDate = (date) => tasks.filter(task => task.date === date);

    const daysInMonth = getDaysInMonth(currentDate);
    const startDay = startOfMonth(currentDate).getDay();

    return (
        <div className="calendar-container">
            <h1 className="calendar-title">{format(currentDate, 'MMMM yyyy')}</h1>
        
            <div className="calendar-nav">
                <button onClick={handlePreviousMonth} className="nav-button">Previous</button>
                <button onClick={() => setCurrentDate(new Date())} className="nav-button">Today</button>
                <button onClick={handleNextMonth} className="nav-button">Next</button>
            </div>
        
            <div className="calendar-grid">
                {[...Array(startDay).keys()].map((_, i) => (
                    <div key={i} className="calendar-cell empty"></div>
                ))}
                {[...Array(daysInMonth).keys()].map(day => {
                    const date = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day + 1), 'yyyy-MM-dd');
                    const dayEvents = getEventsForDate(date);
                    const dayTasks = getTasksForDate(date);
                    const isToday = date === format(new Date(), 'yyyy-MM-dd');
                    const isPastDate = isBefore(new Date(date), startOfDay(new Date()));
                    
                    return (
                        <div 
                            key={day} 
                            onClick={() => !isPastDate && handleDayClick(date)}
                            className={`calendar-cell ${isToday ? 'today' : ''} ${isPastDate ? 'past-date' : ''}`}
                        >
                            <div className="day-number">{day + 1}</div>
                            <div className="events-container">
                                {dayEvents.map(event => (
                                    <div
                                        key={event.id}
                                        onClick={(e) => handleEventClick(event, e)}
                                        className={`event-item ${event.isImported ? 'imported' : 'user-added'}`}
                                        title={event.title}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                                {dayTasks.map(task => (
                                    <div
                                        key={task.id}
                                        onClick={(e) => handleTaskClick(task, e)}
                                        className="task-item"
                                        title={`${task.title} (${task.duration} min)`}
                                    >
                                        {task.title}
                                    </div>
                                ))}
                            </div>
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

            {taskModalOpen && (
                <TaskModal
                    onClose={() => setTaskModalOpen(false)}
                    onSave={addTask}
                    selectedDate={selectedDate}
                />
            )}

            {showActionModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '5px'
                    }}>
                        <h2>Add to {selectedDate}</h2>
                        <button onClick={() => { setModalOpen(true); setShowActionModal(false); }}>Add Event</button>
                        <button onClick={() => { setTaskModalOpen(true); setShowActionModal(false); }}>Add Task</button>
                        <button onClick={() => setShowActionModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {selectedTask && (
                <div className="task-dialog-overlay" onClick={() => setSelectedTask(null)}>
                    <div className="task-dialog" onClick={e => e.stopPropagation()}>
                        <div className="task-dialog-header">
                            <h2>Task: {selectedTask.title}</h2>
                            <button className="close-button" onClick={() => setSelectedTask(null)}>×</button>
                        </div>
                        <div className="task-dialog-content">
                            <p>Time Remaining: {formatTime(selectedTask.timeRemaining)}</p>
                            <button onClick={isTimerRunning ? handlePauseTimer : handleStartTimer}>
                                {isTimerRunning ? 'Pause' : 'Start'} Timer
                            </button>
                            <button onClick={handleResetTimer}>Reset Timer</button>
                        </div>
                    </div>
                </div>
            )}

            {showTimerEndModal && (
                <TimerEndModal
                    task={completedTask}
                    onClose={handleEndTask}
                />
            )}
        </div>
    );
};

export default Calendar;