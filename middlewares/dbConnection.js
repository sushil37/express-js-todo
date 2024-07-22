import createMysqlConnection from '../config/db.js';

const dbConnectionMiddleware = async (req, res, next) => {
  try {
    req.dbConnection = await createMysqlConnection(); // Attach the connection to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection error' });
  }
};

export default dbConnectionMiddleware;
