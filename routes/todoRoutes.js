import express from 'express';
import {
  addTodo,
  updateTodo,
  deleteTodo,
  listTodos,
  updateDoneStatus
} from '../controllers/todoController.js';

const router = express.Router();

router.get('/todos', listTodos);
router.post('/todos', addTodo);
router.put('/todos/:id', updateTodo);
router.patch('/todos/:id/done', updateDoneStatus);
router.delete('/todos/:id', deleteTodo);

export default router;
