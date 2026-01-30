const BASE_URL = "https://task-manager-backend-1t4f.onrender.com";

// Get all tasks
export const getTasks = async () => {
  const res = await fetch(`${BASE_URL}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

// Add new task
export const addTask = async (text) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error("Failed to add task");
  return res.json();
};

// Delete task by _id
export const deleteTask = async (_id) => {
  const res = await fetch(`${BASE_URL}/tasks/${_id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
};

// Update task text by _id
export const updateTaskText = async (_id, text) => {
  const res = await fetch(`${BASE_URL}/tasks/${_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
};

// Toggle task completion by _id
export const toggleTaskCompletion = async (_id, completed) => {
  const res = await fetch(`${BASE_URL}/tasks/${_id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });

  if (!res.ok) throw new Error("Failed to toggle task completion");
  return res.json();
};

// Aliases for clarity
export const addTaskAPI = addTask;
export const deleteTaskAPI = deleteTask;

