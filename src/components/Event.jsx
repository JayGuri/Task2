import React from 'react';

const Event = ({ event }) => {
    return (
        <div className="event">
            {event.title}
            {!event.isImported && (
                <button onClick={() => event.onDelete(event.id)}>Delete</button>
            )}
        </div>
    );
};

export default Event;
