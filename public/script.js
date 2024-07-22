let currentEditingTodo = null;

document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.getElementById("todoForm");
    const filterSelect = document.getElementById("filterSelect");

    initializeForm(todoForm);
    loadTodos();

    if (filterSelect) {
        filterSelect.addEventListener("change", loadTodos);
    }

    todoForm.addEventListener("submit", handleSubmit);
});

function initializeForm(todoForm) {
    const submitButton = createButton("Add Todo", "btn btn-primary", "submit");
    todoForm.appendChild(submitButton);

    const resetButton = createButton("Reset Form", "btn btn-secondary", "button");
    resetButton.addEventListener("click", resetForm);
    todoForm.appendChild(resetButton);
}

function createButton(text, className, type) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add(...className.split(" "));
    button.type = type;
    return button;
}

function resetForm() {
    const todoForm = document.getElementById("todoForm");
    todoForm.reset();
    const submitButton = todoForm.querySelector("button[type='submit']");
    submitButton.textContent = "Add Todo";
    currentEditingTodo = null;
}

async function loadTodos() {
    showLoadingIndicator();
    const filter = document.getElementById("filterSelect").value;
    try {
        const response = await fetch(`/api/todos?filter=${filter}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const todos = await response.json();
        addTodoToList(todos);
    } catch (error) {
        showError("Error loading todos: " + error.message);
    } finally {
        hideLoadingIndicator();
    }
}

function addTodoToList(todos) {
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = "";

    const todoData = todos.data || [];
    if (todoData.length === 0) {
        const noTodosMessage = document.createElement("li");
        noTodosMessage.textContent = "No todos found.";
        todoList.appendChild(noTodosMessage);
    } else {
        todoData.forEach(todo => {
            const todoItem = createTodoItem(todo);
            todoList.appendChild(todoItem);
        });
    }
}

function createTodoItem(todo) {
    const todoItem = document.createElement("li");
    todoItem.textContent = `${todo.name} - ${todo.description} - ${new Date(todo.dateTime).toLocaleString()}`;
    todoItem.dataset.id = todo.id;

    if (todo.done) {
        todoItem.classList.add("highlight");
    }

    const buttonContainer = createButtonContainer(todo);
    todoItem.appendChild(buttonContainer);

    return todoItem;
}

function createButtonContainer(todo) {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const editButton = createButton("Edit", "btn edit-btn", "button");
    editButton.addEventListener("click", () => editTodo(todo));
    
    const deleteButton = createButton("Delete", "btn delete-btn", "button");
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    const toggleDoneButton = createButton(todo.done ? "Mark as Pending" : "Mark as Done", "btn toggle-done-btn", "button");
    toggleDoneButton.addEventListener("click", () => updateDoneStatus(todo));

    buttonContainer.append(editButton, deleteButton, toggleDoneButton);
    return buttonContainer;
}

async function updateDoneStatus(todo) {
    try {
        const response = await fetch(`/api/todos/${todo.id}/done`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ done: !todo.done }),
        });

        if (!response.ok) throw new Error("Failed to update done status");

        const updatedTodo = await response.json();
        updateTodoItemDisplay(updatedTodo);
    } catch (error) {
        showError("Error updating done status: " + error.message);
    }
}

function updateTodoItemDisplay(updatedTodo) {
    const todoItem = document.querySelector(`li[data-id='${updatedTodo.data.id}']`);
    todoItem.textContent = `${updatedTodo.data.name} - ${updatedTodo.data.description} - ${new Date(updatedTodo.data.dateTime).toLocaleString()}`;
    
    if (updatedTodo.data.done) {
        todoItem.classList.add("highlight");
    } else {
        todoItem.classList.remove("highlight");
    }

    const toggleDoneButton = todoItem.querySelector(".toggle-done-btn");
    if (toggleDoneButton) {
        toggleDoneButton.textContent = updatedTodo.data.done ? "Mark as Pending" : "Mark as Done";
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const dateTime = document.getElementById("dateTime").value;

    // Basic validation
    if (!name || !description || !dateTime) {
        showError("All fields are required.");
        return;
    }

    const todoData = { name, description, dateTime };

    if (currentEditingTodo) {
        await updateTodo(currentEditingTodo.id, todoData);
    } else {
        await createTodo(todoData);
    }
}

async function createTodo(todoData) {
    try {
        const response = await fetch("/api/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todoData),
        });

        if (!response.ok) throw new Error("Failed to create todo");

        const createdTodo = await response.json();
        addTodoToList([createdTodo]);
        resetForm();
        showSuccess("Todo added successfully!");
    } catch (error) {
        showError("Error creating todo: " + error.message);
    }
}

async function updateTodo(todoId, todoData) {
    try {
        const response = await fetch(`/api/todos/${todoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todoData),
        });

        if (!response.ok) throw new Error("Failed to update todo");

        const updatedTodo = await response.json();
        updateTodoItemDisplay(updatedTodo);
        resetForm();
        showSuccess("Todo updated successfully!");
    } catch (error) {
        showError("Error updating todo: " + error.message);
    }
}

function editTodo(todo) {
    document.getElementById("name").value = todo.name;
    document.getElementById("description").value = todo.description;

    const date = new Date(todo.dateTime);
    document.getElementById("dateTime").value = date.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM

    const todoForm = document.getElementById("todoForm");
    const submitButton = todoForm.querySelector("button[type='submit']");
    submitButton.textContent = "Edit Todo";

    currentEditingTodo = todo;
}

async function deleteTodo(todoId) {
    try {
        const response = await fetch(`/api/todos/${todoId}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete todo");

        loadTodos();
        showSuccess("Todo deleted successfully!");
    } catch (error) {
        showError("Error deleting todo: " + error.message);
    }
}

function showLoadingIndicator() {
}

function hideLoadingIndicator() {
}

function showError(message) {
    console.error(message);
}

function showSuccess(message) {
    console.log(message);
}