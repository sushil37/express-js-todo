document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todoForm");
  const submitButton = document.createElement("button");
  todoForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const dateTime = document.getElementById("dateTime").value;
    const newTodo = {
      name,
      description,
      dateTime,
    };

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }

      const createdTodo = await response.json();
      addTodoToList([createdTodo]); // Pass the created todo as an array
      todoForm.reset(); // Reset the form fields
      submitButton.textContent = "Add Todo"; // Reset button text
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  });

  loadTodos();
});

async function loadTodos() {
  try {
    const response = await fetch("/api/todos");
    const todos = await response.json();
    addTodoToList(todos);
  } catch (error) {
    console.error("Error loading todos:", error);
  }
}

// Function to add todos to the list
function addTodoToList(todos) {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = ""; // Clear the existing list

  if (todos.length === 0) {
    const noTodosMessage = document.createElement("li");
    noTodosMessage.textContent = "No todos found.";
    todoList.appendChild(noTodosMessage);
  } else {
    todos.forEach((todo) => {
      const todoItem = document.createElement("li");
      todoItem.textContent = `${todo.name} - ${todo.description} - ${new Date(
        todo.dateTime
      ).toLocaleString()}`;
      todoItem.dataset.id = todo.id;

      // Create a container for buttons
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("button-container");

      // Create Edit Button
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.classList.add("btn", "edit-btn");
      editButton.addEventListener("click", () => editTodo(todo));

      // Create Delete Button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("btn", "delete-btn");
      deleteButton.addEventListener("click", () => deleteTodo(todo.id));

      // Append buttons to button container
      buttonContainer.appendChild(editButton);
      buttonContainer.appendChild(deleteButton);

      // Append button container to todo item
      todoItem.appendChild(buttonContainer);
      todoList.appendChild(todoItem);
    });
  }
}

// Function to edit a todo
function editTodo(todo) {
  // Populate the form with the current todo data
  document.getElementById("name").value = todo.name;
  document.getElementById("description").value = todo.description;

  // Format the date for the datetime-local input
  const date = new Date(todo.dateTime);
  const formattedDate = date.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
  document.getElementById("dateTime").value = formattedDate;

  // Change the form submission to update mode
  const todoForm = document.getElementById("todoForm");
  const submitButton = todoForm.querySelector("button[type='submit']");
  submitButton.textContent = "Edit Todo"; // Change button text to "Edit Todo"

  todoForm.onsubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const updatedTodo = {
      name: document.getElementById("name").value,
      description: document.getElementById("description").value,
      dateTime: document.getElementById("dateTime").value,
    };

    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      const updatedTodoData = await response.json();
      loadTodos(); 
      todoForm.reset(); 
      submitButton.textContent = "Add Todo"; // Reset button text
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Function to delete a todo
  async function deleteTodo(todoId) {
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      loadTodos(); // Reload the todos to reflect changes
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }
}
