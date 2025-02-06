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

    const todo = await prisma.todo.update({
      where: { 
        id: todoId,
        listId: list.id
      },
      data: { state }
    });

    return res.status(200).json({ todo });
  } catch (error) {
    console.error('Error updating Todo:', error);
    return res.status(500).json({ error: 'Failed to update Todo' });
  }
});

module.exports = router;