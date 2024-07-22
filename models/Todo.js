import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const Todo = {
  create: async (todo) => {
    const { name, description, dateTime } = todo;

    return await prisma.todo.create({
      data: {
        name,
        description,
        dateTime,
      },
    });
  },

  update: async (id, updates) => {
    const { name, description, dateTime, done } = updates;
    return await prisma.todo.update({
      where: { id },
      data: {
        name,
        description,
        dateTime: dateTime,
        done,
      },
    });
  },

  delete: async (id) => {
    return await prisma.todo.delete({
      where: { id },
    });
  },

  findAll: async (filter) => {
    const where =
      filter === "done"
        ? { done: true }
        : filter === "pending"
        ? { done: false }
        : {};
    return await prisma.todo.findMany({ where });
  },
};

export default Todo;
