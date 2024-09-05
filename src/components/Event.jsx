import React from 'react';

const Event = ({ event }) => {
    return (
        <div className="event">
            {event.title}
            {/* Render the delete button only if the event is not imported */}
            {!event.isImported && (
                <button onClick={() => event.onDelete(event.id)}>Delete</button>
            )}
        </div>
    );
};

export default Event;
