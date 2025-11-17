const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const DATA_FILE = path.join(__dirname, '../data/todos.json');

const loadTodos = () => {
  try {
    const data = fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};


const saveTodos = (todos) => {
  fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2));
};


exports.getAllTodos = (filters) => {
  let todos = loadTodos();


  if (filters.status === 'active') {
    todos = todos.filter(t => !t.completed);
  } else if (filters.status === 'completed') {
    todos = todos.filter(t => t.completed);
  }

  
  if (filters.priority) {
    todos = todos.filter(t => t.priority === filters.priority);
  }

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    todos = todos.filter(t => t.title.toLowerCase().includes(searchLower));
  }

  // Sort by createdAt descending (newest first)
  todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Calculate pagination
  const total = todos.length;
  const totalPages = Math.ceil(total / filters.limit);
  const start = (filters.page - 1) * filters.limit; 
  const end = start + filters.limit;
  const paginatedTodos = todos.slice(start, end);

  return {
      data: paginatedTodos,
      pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages
    }
  };
};

// Get todo by ID
exports.getTodoById = (id) => {
  const todos = loadTodos();
  return todos.find(t => t.id === id);
};

// Create new todo
exports.createTodo = (todoData) => {
  const todos = loadTodos();
  
  const newTodo = {
    id: crypto.randomUUID(),
    title: todoData.title,
    completed: false,
    priority: todoData.priority,
    dueDate: todoData.dueDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  todos.push(newTodo);
  saveTodos(todos);
  
  return newTodo;
};

// Update todo
exports.updateTodo = (id, updates) => {
  const todos = loadTodos();
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return null;
  }

  todos[index] = {
    ...todos[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  saveTodos(todos);
  return todos[index];
};

// Delete todo
exports.deleteTodo = (id) => {
  const todos = loadTodos();
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return false;
  }

  todos.splice(index, 1);
  saveTodos(todos);
  return true;
};

// Toggle completed status
exports.toggleTodo = (id) => {
  const todos = loadTodos();
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return null;
  }

  todos[index].completed = !todos[index].completed;
  todos[index].updatedAt = new Date().toISOString();

  saveTodos(todos);
  return todos[index];
};