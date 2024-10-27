import React, { useState, useEffect } from 'react';

const EventModal = ({ onClose, onSave, onDelete, selectedEvent }) => {
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (selectedEvent) {
            setTitle(selectedEvent.title);
        } else {
            setTitle('');
        }
    }, [selectedEvent]);

    const handleSave = () => {
        if (title.trim()) {
            onSave(title);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
                <h2>{selectedEvent ? 'Edit Event' : 'Add Event'}</h2>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Event Title" 
                    style={{ width: '100%', marginBottom: '10px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={handleSave}>{selectedEvent ? 'Update' : 'Save'}</button>
                    {onDelete && <button onClick={onDelete}>Delete</button>}
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
