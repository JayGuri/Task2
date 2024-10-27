import React, { useState } from 'react';

const TaskModal = ({ onClose, onSave, selectedDate }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDuration, setTaskDuration] = useState('');

  const handleSave = () => {
    if (taskName.trim() && taskDuration) {
      onSave(taskName, parseInt(taskDuration, 10));
    }
  };

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
        width: '300px'
      }}>
        <h2>Add Task for {selectedDate}</h2>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task Name"
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
        />
        <input
          type="number"
          value={taskDuration}
          onChange={(e) => setTaskDuration(e.target.value)}
          placeholder="Duration (minutes)"
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;