import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const Todo = {
  create: async (todo) => {
    return await prisma.todo.create({
      data: {
        name: todo.name,
        description: todo.description,
        dateTime: todo.dateTime,
      },
    });
  },

  update: async (id, updates) => {
    return await prisma.todo.update({
      where: { id },
      data: updates,
    });
  },

  delete: async (id) => {
    return await prisma.todo.delete({
      where: { id },
    });
  },

  findAll: async (filter) => {
    const where = filter === 'done' ? { done: true } : filter === 'pending' ? { done: false } : {};
    return await prisma.todo.findMany({ where });
  },
};

export default Todo;
