# Just a Todo App using Express.js

## Overview

Just a Todo App is a simple web application built with Express.js that allows users to create, read, update, and delete todos. The application uses Prisma as an ORM to interact with a MySQL database, providing a seamless experience for managing tasks.

## Features

- Create new todos
- Read and filter existing todos
- Update existing todos
- Delete todos
- Mark todos as done or pending

## Prerequisites

- Node.js installed on your machine
- MySQL database set up and running

## Installation

### Clone the repository:

```bash
git clone https://github.com/yourusername/just-a-todo-app.git
cd just-a-todo-app
```

### Install dependencies::

```bash
npm install
```

### Update .env file:

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Note: Replace USER, PASSWORD, HOST, PORT, and DATABASE with your MySQL credentials.

### Run Prisma migrations:

To set up the database schema, run the following command:

```bash
npx prisma migrate dev --name init
```

### Run Prisma migrations:

To start the application in development mode, use:

```bash
npm run dev
```

This will start the server and watch for file changes. You can access the application at http://localhost:3000.

### To run the application in production mode, use:

```bash
npm start
```
