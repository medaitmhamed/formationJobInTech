const todoService = require("../services/todoService");

// Get all todos with filters and pagination
const getAllTodos = (req, res, next) => {
  try {
    const { status = "all", priority, q, page = 1, limit = 10 } = req.query;

    const filters = {
      status,
      priority,
      search: q,
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const result = todoService.getAllTodos(filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Get todo by ID
const getTodoById =  (req, res, next) => {
  try {
    const todo = todoService.getTodoById(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo);
  } catch (error) {
    next(error);
  }
};

const validateTitle = (title) => {
  return typeof title === "string" && title.trim().length > 0;
};

const validatePriority = (priority) => {
  return ["low", "medium", "high"].includes(priority);
};

const validateDueDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(new Date(d));


const createTodo =  (req, res, next) => {
  try {
    const { title, priority = "medium", dueDate } = req.body;

    if (!validateTitle(title)) {
      return res
        .status(400)
        .json({ error: "Title is required and must be a non-empty string" });
    }

    if (priority && !validatePriority(priority)) {
      return res
        .status(400)
        .json({ error: "Priority must be low, medium, or high" });
    }

    if (dueDate && !validateDueDate(dueDate)) {
      return res
        .status(400)
        .json({ error: "Due date must be in YYYY-MM-DD format" });
    }

    const todoData = {
      title: title.trim(),
      priority,
      dueDate: dueDate || null,
    };

    const newTodo = todoService.createTodo(todoData);
    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
};


const updateTodo =  (req, res, next) => {
  try {
    const allowedFields = ["title", "completed", "priority", "dueDate"];
    const updates = {};

    const requestFields = Object.keys(req.body);
    const unknownFields = requestFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (unknownFields.length > 0) {
      return res.status(400).json({
        error: `Unknown fields: ${unknownFields.join(", ")}`,
      });
    }

    if (req.body.title !== undefined) {
      if (!validateTitle(req.body.title)) {
        return res
          .status(400)
          .json({ error: "Title must be a non-empty string" });
      }
      updates.title = req.body.title.trim();
    }

    if (req.body.completed !== undefined) {
      if (typeof req.body.completed !== "boolean") {
        return res.status(400).json({ error: "Completed must be a boolean" });
      }
      updates.completed = req.body.completed;
    }

    if (req.body.priority !== undefined) {
      if (!validatePriority(req.body.priority)) {
        return res
          .status(400)
          .json({ error: "Priority must be low, medium, or high" });
      }
      updates.priority = req.body.priority;
    }

    if (req.body.dueDate !== undefined) {
      if (req.body.dueDate !== null && !validateDueDate(req.body.dueDate)) {
        return res
          .status(400)
          .json({ error: "Due date must be in YYYY-MM-DD format" });
      }
      updates.dueDate = req.body.dueDate;
    }

    const updatedTodo = todoService.updateTodo(req.params.id, updates);

    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(updatedTodo);
  } catch (error) {
    next(error);
  }
};


const toggleTodo =  (req, res, next) => {
  try {
    const toggledTodo = todoService.toggleTodo(req.params.id);

    if (!toggledTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(toggledTodo);
  } catch (error) {
    next(error);
  }
};

const deleteTodo =  (req, res, next) => {
  try {
    const deleted = todoService.deleteTodo(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
};
