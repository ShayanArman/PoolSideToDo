const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();
const prisma = new PrismaClient()

// Create a new Todo ? text and listKey needed.
router.post('/', async (req, res) => {
  const { text, listKey } = req.query;
  if (!text || !listKey) {
    return res.status(400).json({ error: 'Both text and listKey are required' });
  }

  try {
    // Verify the TodoList exists
    const todoList = await prisma.todoList.findUnique({
      where: { shareKey: listKey },
    });

    if (!todoList) {
      return res.status(404).json({ error: "TodoList not found" });
    }
    
    const todo = await prisma.todo.create({
      data: { text, listId: todoList.id }
    });
    
    if (!todo) {
      throw new Error("Unable to create Todo");
    }

    return res.status(201).json({ todo });
  } catch (error) {
    console.error('Error creating Todo:', error);
    return res.status(500).json({ error: 'Failed to create Todo' });
  }
});


// Get a list of todos ? listKey needed.
router.get('/', async (req, res) => {
  try {
    const { listKey } = req.query;
    
    const list = await prisma.todoList.findUnique({ where: { shareKey: listKey } });
    if (!list) {
      return res.status(404).json({ error: 'TodoList not found' });
    }

    const todos = await prisma.todo.findMany({
      where: { listId: list.id }
    });

    if (!todos) {
      return res.status(404).json({ error: 'List not found' });
    }

    return res.status(200).json({ todos });
  } catch (error) {
    console.error('Error fetching Todo List:', error);
    return res.status(500).json({ error: 'Failed to retrieve list of Todos' });
  }
});

function isTransitionAllowed(currentState, targetState) {
  const allowedTransitions = {
    "TODO": ["ONGOING"],
    "ONGOING": ["TODO", "DONE"],
    "DONE": ["ONGOING"]
  };

  return allowedTransitions[currentState].includes(targetState);
}

// in the best place check for 'allowed' transitions.
// if it is not allowed throw an error. make a helper function to check for allowed transitions.
router.patch('/:todoId', async (req, res) => {
  const { todoId } = req.params;
  // include the listKey just to make sure they only edit todos that they have access to.
  // further we can check the userId as well.
  const { listKey } = req.query;
  const { state } = req.body;

  if (!state || !listKey) {
    return res.status(400).json({ error: 'State and listKey are required' });
  }

  try {
    const list = await prisma.todoList.findUnique({ where: { shareKey: listKey } });
    if (!list) {
      return res.status(404).json({ error: 'TodoList not found' });
    }

    const currentTodo = await prisma.todo.findUnique({
      where: { id: todoId, listId: list.id }
    });
    if (!currentTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (!isTransitionAllowed(currentTodo.state, newState)) {
      return res.status(400).json({ error: 'Invalid state transition' });
    }

    const todo = await prisma.todo.update({
      where: { 
        id: todoId,
        listId: list.id
      },
      data: { updatedAt: new Date(), state }
    });

    return res.status(200).json({ todo });
  } catch (error) {
    console.error('Error updating Todo:', error);
    return res.status(500).json({ error: 'Failed to update Todo' });
  }
});

router.delete('/:todoId', async (req, res) => {
  const { todoId } = req.params;
  const { listKey } = req.query;
 
  if (!listKey) {
    return res.status(400).json({ error: 'ListKey is required' });
  }
 
  try {
    const list = await prisma.todoList.findUnique({ where: { shareKey: listKey } });
    if (!list) {
      return res.status(404).json({ error: 'TodoList not found' });
    }
 
    await prisma.todo.delete({
      where: { 
        id: todoId,
        listId: list.id
      }
    });
 
    return res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting Todo:', error);
    return res.status(500).json({ error: 'Failed to delete Todo' });
  }
 });

module.exports = {
  router,
  isTransitionAllowed,
};