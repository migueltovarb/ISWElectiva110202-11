import React from 'react';

const TaskList = ({ tasks, onEdit, onDelete }) => {
  if (tasks.length === 0) 
    return <p className="text-center text-gray-500 mt-10">No tasks available</p>;

  return (
    <ul className="max-w-md mx-auto space-y-4">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`flex justify-between items-center p-4 rounded-md shadow ${
            task.status === 'completed' ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <div>
            <strong className="text-lg">{task.name}</strong>{' '}
            <em className={`capitalize ${task.status === 'completed' ? 'text-green-700' : 'text-red-700'}`}>
              {task.status}
            </em>
          </div>
          <div>
            <button
              onClick={() => onEdit(task)}
              className="text-blue-600 hover:underline mr-4"
              aria-label={`Edit ${task.name}`}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
              aria-label={`Delete ${task.name}`}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
