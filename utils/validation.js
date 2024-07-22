// Validation function for Todo data
export const validateTodoData = (todoData) => {
    const { name, description, dateTime } = todoData;
  
    // Check if all required fields are present
    if (!name || typeof name !== 'string') {
      throw new Error('Name is required and must be a string.');
    }
    
    if (!description || typeof description !== 'string') {
      throw new Error('Description is required and must be a string.');
    }
  
    if (!dateTime || isNaN(Date.parse(dateTime))) {
      throw new Error('DateTime is required and must be a valid date.');
    }
  };
  