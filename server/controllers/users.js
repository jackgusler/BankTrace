const express = require('express');
const { getAll, get, query, create, update, remove, login } = require('../models/users'); // Import the User model
const router = express.Router();

router
  .get('/', async (req, res, next) => {
    try {
      const users = await getAll();
      res.send(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  })

  .get('/search', async (req, res, next) => {
    try {
      const users = await query(req.query);
      res.send(users);
    } catch (error) {
      console.error('Error searching for users:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const user = await get(+req.params.id);
      res.send(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  })

  .post('/', async (req, res, next) => {
    try {
      const newUser = await create(req.body);
      res.send(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  })

  .post('/login', async (req, res, next) => {
    try {
      const user = await login(req.body.email, req.body.password);
      res.send(user);
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  })

  .post('/signup', async (req, res, next) => {
    try {
      const newUser = await create(req.body);
      res.send(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  })

  .patch('/:id', async (req, res, next) => {
    try {
      const updatedUser = await update({ ...req.body, id: req.params.id });
      res.send(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  })

  .delete('/:id', async (req, res, next) => {
    try {
      const deletedUser = await remove(+req.params.id);
      res.send(deletedUser);
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
