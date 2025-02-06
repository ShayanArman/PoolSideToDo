const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();
const prisma = new PrismaClient()

router.post('/', async (req, res) => {
  try {
    const list = await prisma.todoList.create({
      data: {}
    });

    if (!list) {
      throw new Error("Unable to create list");
    }
    
    return res.status(201).json({
      list
    })
  } catch (error) {
    console.error('Error creating list:', error)
    return res.status(500).json({
      error: 'Failed to create lis'
    })
  }
})

router.get('/:shareKey', async (req, res) => {
  try {
    const { shareKey } = req.params;
    const list = await prisma.todoList.findUnique({
      where: { shareKey }
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    return res.status(200).json({ list });
  } catch (error) {
    console.error('Error fetching list:', error);
    return res.status(500).json({ error: 'Failed to retrieve list' });
  }
});

module.exports = router;