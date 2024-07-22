import express from 'express';
import {
  addTodo,
  updateTodo,
  deleteTodo,
  listTodos,
} from '../controllers/todoController.js';

const router = express.Router();

router.post('/todos', addTodo);
router.put('/todos/:id', updateTodo);
router.delete('/todos/:id', deleteTodo);
router.get('/todos', listTodos);

export default router;
