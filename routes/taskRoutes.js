const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const jwt = require('jsonwebtoken');

// Middleware to authenticate and set user ID from JWT
const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error(`JWT verification error: ${err.message}`, err);
        return res.status(401).json({ message: 'You are not authenticated' });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  } else {
    console.log("No JWT token found, user is not authenticated.");
    return res.status(401).json({ message: 'No token found, you are not authenticated' });
  }
};

// POST /tasks - Create a new task
router.post('/tasks', isAuthenticated, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            user: req.userId
        });
        await task.save();
        console.log(`Task created: ${task.name}`);
        res.status(201).json(task);
    } catch (error) {
        console.error(`Error creating task: ${error.message}`, error);
        res.status(400).json({ message: error.message });
    }
});

// GET /tasks - Fetch all tasks for the logged-in user
router.get('/tasks', isAuthenticated, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.userId });
        console.log(`Fetched ${tasks.length} tasks for user ID ${req.userId}`);
        res.json(tasks);
    } catch (error) {
        console.error(`Error fetching tasks: ${error.message}`, error);
        res.status(500).json({ message: error.message });
    }
});

// PUT /tasks/:id - Update a task by id
router.put('/tasks/:id', isAuthenticated, async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true }
        );
        if (!updatedTask) {
            console.log(`Task not found with ID ${req.params.id}`);
            return res.status(404).json({ message: 'Task not found' });
        }
        console.log(`Task updated: ${updatedTask.name}`);
        res.json(updatedTask);
    } catch (error) {
        console.error(`Error updating task: ${error.message}`, error);
        res.status(400).json({ message: error.message });
    }
});

// DELETE /tasks/:id - Delete a task by id
router.delete('/tasks/:id', isAuthenticated, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!task) {
            console.log(`Task not found with ID ${req.params.id}`);
            return res.status(404).json({ message: 'Task not found' });
        }
        console.log(`Task deleted: ${task.name}`);
        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting task: ${error.message}`, error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;