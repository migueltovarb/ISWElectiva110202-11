import React, { useState, useEffect } from 'react';

const TaskForm = ({ onSave, taskToEdit, onCancel }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    if (taskToEdit) {
      setName(taskToEdit.name);
      setStatus(taskToEdit.status);
    } else {
      setName('');
      setStatus('pending');
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '') return alert('Name is required');

    onSave({ name, status, id: taskToEdit ? taskToEdit.id : undefined });
    setName('');
    setStatus('pending');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <input
        type="text"
        placeholder="Task name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
      <div className="flex justify-between items-center">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {taskToEdit ? 'Update' : 'Add'}
        </button>
        {taskToEdit && (
          <button
            type="button"
            onClick={onCancel}
            className="ml-4 px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
