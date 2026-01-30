import { useState, useEffect } from "react";
import TaskForm from "../components/taskForm.jsx";
import "../styles/dashboard.css";
import {
  getTasks,
  addTask as addTaskAPI,
  deleteTask as deleteTaskAPI,
  toggleTaskCompletion,
  updateTaskText as updateTaskAPI,
} from "../services/api.js";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // for initial load
  const [error, setError] = useState(null); // general error message
  const [loadingTaskId, setLoadingTaskId] = useState(null); // for individual task actions

  // Load tasks from backend
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  // Add new task
  const addTask = async (text) => {
    setError(null);
    try {
      const newTask = await addTaskAPI(text);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      console.error(err);
      setError("Failed to add task.");
    }
  };

  // Delete task
  const deleteTask = async (_id) => {
    setLoadingTaskId(_id);
    setError(null);
    const originalTasks = [...tasks];

    setTasks((prev) => prev.filter((t) => t._id !== _id)); // optimistic UI

    try {
      await deleteTaskAPI(_id);
    } catch (err) {
      console.error(err);
      setTasks(originalTasks); // rollback
      setError("Failed to delete task.");
    } finally {
      setLoadingTaskId(null);
    }
  };

  // Toggle completion
  const toggleComplete = async (_id) => {
    setLoadingTaskId(_id);
    setError(null);
    const task = tasks.find((t) => t._id === _id);
    const newStatus = !task.completed;

    setTasks((prev) =>
      prev.map((t) => (t._id === _id ? { ...t, completed: newStatus } : t))
    );

    try {
      await toggleTaskCompletion(_id, newStatus);
    } catch (err) {
      console.error(err);
      // rollback
      setTasks((prev) =>
        prev.map((t) => (t._id === _id ? { ...t, completed: task.completed } : t))
      );
      setError("Failed to update task.");
    } finally {
      setLoadingTaskId(null);
    }
  };

  // Start editing
  const startEdit = (_id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t._id === _id ? { ...t, isEditing: true, originalText: t.text } : t
      )
    );
  };

  // Cancel editing
  const cancelEdit = (_id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t._id === _id ? { ...t, text: t.originalText, isEditing: false } : t
      )
    );
  };

  // Save edited task
 const saveEdit = async (id, text) => {
  try {
    const updatedTask = await updateTaskAPI(id, { text });

    setTasks(prev =>
      prev.map(task =>
        task._id === id
          ? { ...updatedTask, isEditing: false }
          : task
      )
    );
  } catch (err) {
    console.error(err);
    alert("Failed to save task");
  }
};
  return (
    <div className="dashboard">
      <h1 className="title">Task Dashboard</h1>

      {error && <p className="error">{error}</p>}

      <TaskForm addTask={addTask} />

      {tasks.map((task) => (
        <div key={task._id} className={`task ${task.completed ? "completed" : ""}`}>
          <div className="task-item">
            <input
              type="checkbox"
              checked={task.completed}
              disabled={loadingTaskId === task._id}
              onChange={() => toggleComplete(task._id)}
            />

            <div className="task-content">
              {task.isEditing ? (
                <input
                  type="text"
                  value={task.text}
                  onChange={(e) =>
                    setTasks((prev) =>
                      prev.map((t) =>
                        t._id === task._id ? { ...t, text: e.target.value } : t
                      )
                    )
                  }
                />
              ) : (
                <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                  {task.text}
                </span>
              )}
            </div>

            <div className="task-actions">
              {task.isEditing ? (
                <>
                  <button
                    className="save"
                    disabled={loadingTaskId === task._id}
                    onClick={() => saveEdit(task._id, task.text)}
                  >
                    💾
                  </button>
                  <button
                    className="delete"
                    disabled={loadingTaskId === task._id}
                    onClick={() => deleteTask(task._id)}
                  >
                    ❌
                  </button>
                  <button className="cancel" onClick={() => cancelEdit(task._id)}>
                    ✖️
                  </button>
                </>
              ) : (
                <>
                  <button className="edit" onClick={() => startEdit(task._id)}>
                    ✏️
                  </button>
                  <button
                    className="delete"
                    disabled={loadingTaskId === task._id}
                    onClick={() => deleteTask(task._id)}
                  >
                    ❌
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;

