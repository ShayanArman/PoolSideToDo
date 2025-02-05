const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();
const prisma = new PrismaClient()

router.post('/api/v1/users', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {}
    });

    if (!user) {
      throw new Error("unable to create user");
    }
    
    return res.status(201).json({
      user
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return res.status(500).json({
      error: 'Failed to create user'
    })
  }
})

module.exports = router;