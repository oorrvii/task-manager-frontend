const BASE_URL = "https://task-manager-backend-h5pl.onrender.com";

// Helper: include token in headers
const getAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// Get all tasks for logged-in user
export const getTasks = async (token) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

// Add new task for logged-in user
export const addTask = async (text, token) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error("Failed to add task");
  return res.json();
};

// Delete task by _id for logged-in user
export const deleteTask = async (_id, token) => {
  const res = await fetch(`${BASE_URL}/tasks/${_id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
};

// Update task text by _id for logged-in user
export const updateTaskAPI = async (id, updates, token) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
    body: JSON.stringify(updates),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok) {
    throw new Error(data?.error || "Failed to save task");
  }

  return data;
};

// Toggle task completion by _id for logged-in user
export const toggleTaskCompletion = async (_id, completed, token) => {
  const res = await fetch(`${BASE_URL}/tasks/${_id}`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ completed }),
  });

  if (!res.ok) throw new Error("Failed to toggle task completion");
  return res.json();
};

// Aliases for clarity
export const addTaskAPI = addTask;
export const deleteTaskAPI = deleteTask;
export const updateTaskText = updateTaskAPI;

// Signup
export const signupUser = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Signup failed");
  return res.json();
};

// Login
export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Login failed");
  }

  const data = await res.json();
  return data.token; // frontend stores this token
};


