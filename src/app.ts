
import fastify, { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import connection from './db';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const app: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify();

// Create a new todo
app.post('/todos', (request, reply) => {
  const { title } = request.body as { title: string };
  connection.query('INSERT INTO todos (title, completed) VALUES (?, ?)', [title, false], (error, results) => {
    if (error) {
      reply.code(500).send({ error: 'Internal server error' });
      return;
    }
    const newTodoId = results.insertId;
    reply.status(201).send({ id: newTodoId, title, completed: false });
  });
});

// Get all todos
app.get('/todos', (request, reply) => {
  connection.query('SELECT * FROM todos', (error, results) => {
    if (error) {
      reply.code(500).send({ error: 'Internal server error' });
      return;
    }
    const todos: Todo[] = results;
    reply.send({ todos });
  });
});

// Update a todo
app.put('/todos/:id', (request:any, reply) => {
    const todoId = parseInt(request.params.id , 10);
  const { title, completed } = request.body as Todo;
  connection.query('UPDATE todos SET title = ?, completed = ? WHERE id = ?', [title, completed, todoId], (error) => {
    if (error) {
      reply.code(500).send({ error: 'Internal server error' });
      return;
    }
    reply.send({ id: todoId, title, completed });
  });
});

// Delete a todo
app.delete('/todos/:id', (request:any, reply) => {
  const todoId = parseInt(request.params.id , 10);
  connection.query('DELETE FROM todos WHERE id = ?', [todoId], (error) => {
    if (error) {
      reply.code(500).send({ error: 'Internal server error' });
      return;
    }
    reply.send({ message: 'Todo deleted successfully' });
  });
});

app.listen(3000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is listening at ${address}`);
});
