const Todo = {
  create: async (todo, dbConnection) => {
    const { name, description, dateTime } = todo;
    const sql = 'INSERT INTO todos (name, description, dateTime) VALUES (?, ?, ?)';
    const [result] = await dbConnection.execute(sql, [name, description, dateTime]);
    return result;
  },

  update: async (id, updates, dbConnection) => {
    const { name, description, dateTime, done } = updates;
    const sql = 'UPDATE todos SET name = ?, description = ?, dateTime = ?, done = ? WHERE id = ?';
    const [result] = await dbConnection.execute(sql, [name, description, dateTime, done, id]);
    return result;
  },

  delete: async (id, dbConnection) => {
    const sql = 'DELETE FROM todos WHERE id = ?';
    const [result] = await dbConnection.execute(sql, [id]);
    return result;
  },

  findAll: async (filter, dbConnection) => {
    let sql = 'SELECT * FROM todos';
    if (filter) {
      sql += filter === 'done' ? ' WHERE done = 1' : ' WHERE done = 0';
    }
    const [results] = await dbConnection.execute(sql);
    return results;
  },
};

export default Todo;
