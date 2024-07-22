import Todo from '../models/todo.js';
import { validateTodoData } from '../utils/validation.js';

// Add a new Todo
export const addTodo = async (req, res) => {
  const todoData = req.body;

  try {
    await validateTodoData(todoData);
    const newTodo = await Todo.create(todoData, req.dbConnection); // Pass the db connection
    res.status(201).json(newTodo);
  } catch (error) {
    handleError(res, error);
  }
};

// Update a Todo
export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedTodo = await Todo.update(id, updatedData, req.dbConnection); // Pass the db connection
    if (!updatedTodo) {
      res.status(404).json({ message: 'Todo not found' });
    } else {
      res.json({ message: 'Todo updated successfully' });
    }
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a Todo
export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await Todo.delete(id, req.dbConnection); // Pass the db connection
    if (!deletedTodo) {
      res.status(404).json({ message: 'Todo not found' });
    } else {
      res.json({ message: 'Todo deleted successfully' });
    }
  } catch (error) {
    handleError(res, error);
  }
};

// List Todos
export const listTodos = async (req, res) => {
  const { filter } = req.query;

  try {
    const todos = await Todo.findAll(filter, req.dbConnection); // Pass the db connection
    res.json(todos);
  } catch (error) {
    handleError(res, error);
  }
};

// Error handling function
const handleError = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Internal server error' });
};
