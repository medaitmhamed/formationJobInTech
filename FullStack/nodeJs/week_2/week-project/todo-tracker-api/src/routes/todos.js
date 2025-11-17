const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");

// Routes - order matters! Specific routes before parameterized ones
router.get("/", todoController.getAllTodos);
router.post("/", todoController.createTodo);
router.get("/:id", todoController.getTodoById);
router.patch("/:id/toggle", todoController.toggleTodo);
router.patch("/:id", todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);

module.exports = router;
