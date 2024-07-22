document.getElementById('todoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const dateTime = document.getElementById('dateTime').value;

    const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, dateTime }),
    });

    if (response.ok) {
        loadTodos();
        document.getElementById('todoForm').reset();
    }
});

document.getElementById('filter').addEventListener('change', loadTodos);

async function loadTodos() {
    const filter = document.getElementById('filter').value;
    const response = await fetch(`/api/todos?filter=${filter}`);
    const todos = await response.json();
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = `${todo.name} - ${todo.description} - ${new Date(todo.dateTime).toLocaleString()}`;
        li.style.textDecoration = todo.done ? 'line-through' : 'none';
        li.addEventListener('click', () => toggleDone(todo.id, !todo.done));
        todoList.appendChild(li);
    });
}

async function toggleDone(id, done) {
    await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ done }),
    });
    loadTodos();
}

// Initial load
loadTodos();
