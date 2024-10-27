import React from 'react';

const TimerEndModal = ({ task, onClose }) => {
    return (
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
                borderRadius: '5px',
                maxWidth: '400px',
                width: '100%'
            }}>
                <h2>Time's Up!</h2>
                <p>The timer for task "{task.title}" has ended.</p>
                <button onClick={onClose} style={{
                    marginTop: '10px',
                    padding: '5px 10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                }}>
                    End Task
                </button>
            </div>
        </div>
    );
};

export default TimerEndModal;