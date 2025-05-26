import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const API_URL = import.meta.env.VITE_API_URL + '/tasks/';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSaveTask = async (task) => {
    try {
      if (task.id) {
        await axios.put(`${API_URL}${task.id}/`, {
          name: task.name,
          status: task.status,
        });
        setTaskToEdit(null);
      } else {
        await axios.post(API_URL, {
          name: task.name,
          status: task.status,
        });
      }
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleCancelEdit = () => {
    setTaskToEdit(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 drop-shadow-md">Task Manager</h1>
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <TaskForm onSave={handleSaveTask} taskToEdit={taskToEdit} onCancel={handleCancelEdit} />
        <hr className="my-6 border-gray-300" />
        <TaskList tasks={tasks} onEdit={setTaskToEdit} onDelete={handleDeleteTask} />
      </div>
    </div>
  );
};

export default App;
