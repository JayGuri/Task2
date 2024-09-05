import React, { useState, useEffect } from 'react';

const EventModal = ({ onClose, onSave, onDelete, selectedEvent }) => {
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (selectedEvent) {
            setTitle(selectedEvent.title);
        }
    }, [selectedEvent]);

    const handleSave = () => {
        if (title.trim()) {
            onSave(title);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{selectedEvent ? 'Edit Event' : 'Add Event'}</h2>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Event Title" 
                />
                <div className="modal-actions">
                    <button onClick={handleSave}>{selectedEvent ? 'Update' : 'Save'}</button>
                    {onDelete && <button onClick={onDelete}>Delete</button>}
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
