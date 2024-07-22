import Todo from '../models/Todo.js';
import { validateTodoData } from '../utils/validation.js';

export const addTodo = async (req, res) => {
  const todoData = req.body;

  try {
    await validateTodoData(todoData);

    // Validate and format dateTime
    if (todoData.dateTime) {
      const date = new Date(todoData.dateTime);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Invalid dateTime format. Expected ISO-8601 DateTime.' });
      }
      todoData.dateTime = date.toISOString(); // Convert to ISO-8601 format
    }

    const newTodo = await Todo.create(todoData);
    res.status(201).json(newTodo);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedTodo = await Todo.update(id, updatedData);
    if (!updatedTodo) {
      res.status(404).json({ message: 'Todo not found' });
    } else {
      res.json({ message: 'Todo updated successfully' });
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await Todo.delete(id);
    if (!deletedTodo) {
      res.status(404).json({ message: 'Todo not found' });
    } else {
      res.json({ message: 'Todo deleted successfully' });
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const listTodos = async (req, res) => {
  const { filter } = req.query;

  try {
    const todos = await Todo.findAll(filter);
    res.json(todos);
  } catch (error) {
    handleError(res, error);
  }
};

const handleError = (res, error) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Internal server error' });
};
