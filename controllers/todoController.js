import Todo from "../models/Todo.js";
import { convertToISO8601 } from "../utils/helpers.js";
import { successResponse, errorResponse, handleError } from "../utils/standardResponse.js";
import { validateTodoData } from "../utils/validation.js";

export const addTodo = async (req, res) => {
  const todoData = req.body;

  try {
    await validateTodoData(todoData);
    if (todoData.dateTime) {
      const isoDateTime = convertToISO8601(todoData.dateTime);
      if (!isoDateTime) {
        return errorResponse(
          res,
          "Invalid dateTime format. Expected ISO-8601 DateTime.",
          400
        );
      }
      todoData.dateTime = isoDateTime;
    }

    const newTodo = await Todo.create(todoData);
    return successResponse(res, "Todo created successfully", newTodo, 201);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  // Convert id to an integer
  const todoId = parseInt(id, 10);
  if (isNaN(todoId)) {
    return errorResponse(res, "Invalid ID format. Expected an integer.", 400);
  }
  const updatedData = req.body;

  // Check and format dateTime if provided
  if (updatedData.dateTime) {
    const isoDateTime = convertToISO8601(updatedData.dateTime);
    if (!isoDateTime) {
      return errorResponse(
        res,
        "Invalid dateTime format. Expected ISO-8601 DateTime.",
        400
      );
    }
    updatedData.dateTime = isoDateTime;
  }

  try {
    const updatedTodo = await Todo.update(todoId, updatedData);
    if (!updatedTodo) {
      return errorResponse(res, "Todo not found", 404);
    } else {
      return successResponse(res, "Todo updated successfully", updatedTodo);
    }
  } catch (error) {
    handleError(res, error);
  }
};


export const updateDoneStatus = async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;

  const todoId = parseInt(id, 10);
  if (isNaN(todoId)) {
    return errorResponse(res, "Invalid ID format. Expected an integer.", 400);
  }

  try {
    const updatedTodo = await Todo.update(todoId, { done });
    if (!updatedTodo) {
      return errorResponse(res, "Todo not found", 404);
    } else {
      return successResponse(res, "Todo done status updated successfully", updatedTodo);
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  const todoId = parseInt(id, 10);
  if (isNaN(todoId)) {
    return errorResponse(res, "Invalid ID format. Expected an integer.", 400);
  }

  try {
    const deletedTodo = await Todo.delete(todoId);
    if (!deletedTodo) {
      return errorResponse(res, "Todo not found", 404);
    } else {
      return successResponse(res, "Todo deleted successfully");
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const listTodos = async (req, res) => {
  const { filter } = req.query;

  try {
    const todos = await Todo.findAll(filter);
    return successResponse(res, "Todo fetched successfully", todos, 200);
  } catch (error) {
    handleError(res, error);
  }
};

