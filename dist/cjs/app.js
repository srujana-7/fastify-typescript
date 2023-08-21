"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const db_1 = __importDefault(require("./db"));
const app = (0, fastify_1.default)();
// Create a new todo
app.post('/todos', (request, reply) => {
    const { title } = request.body;
    db_1.default.query('INSERT INTO todos (title, completed) VALUES (?, ?)', [title, false], (error, results) => {
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
    db_1.default.query('SELECT * FROM todos', (error, results) => {
        if (error) {
            reply.code(500).send({ error: 'Internal server error' });
            return;
        }
        const todos = results;
        reply.send({ todos });
    });
});
// Update a todo
app.put('/todos/:id', (request, reply) => {
    const todoId = parseInt(request.params.id, 10);
    const { title, completed } = request.body;
    db_1.default.query('UPDATE todos SET title = ?, completed = ? WHERE id = ?', [title, completed, todoId], (error) => {
        if (error) {
            reply.code(500).send({ error: 'Internal server error' });
            return;
        }
        reply.send({ id: todoId, title, completed });
    });
});
// Delete a todo
app.delete('/todos/:id', (request, reply) => {
    const todoId = parseInt(request.params.id, 10);
    db_1.default.query('DELETE FROM todos WHERE id = ?', [todoId], (error) => {
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
