const express = require('express');
const dynamoDB = require('../models/dynamoDB'); // Import the DynamoDB module
const router = express.Router();

router
  .get('/', async (req, res, next) => {
    try {
      // Example: Querying all items from DynamoDB
      const params = {
        TableName: 'Users',
      };

      const data = await dynamoDB.scan(params).promise();
      res.send(data.Items);
    } catch (error) {
      console.error('Error fetching all users:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  })

  .get('/search', async (req, res, next) => {
    try {
      // Example: Searching for items in DynamoDB
      const params = {
        TableName: 'Users',
        // Add other query parameters as needed
      };

      const data = await dynamoDB.scan(params).promise();
      // Process data or filter based on req.query.q
      res.send(data.Items);
    } catch (error) {
      console.error('Error searching for users:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      // Example: Getting a single item by ID from DynamoDB
      const params = {
        TableName: 'Users',
        Key: {
          id: +req.params.id,
        },
      };

      const data = await dynamoDB.get(params).promise();
      res.send(data.Item);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  })

  // Other routes (post, patch, delete) can be adapted similarly

  .post('/', async (req, res, next) => {
    try {
      // Example: Creating a new item in DynamoDB
      const params = {
        TableName: 'Users',
        Item: req.body, // Assuming req.body contains the user data
      };

      await dynamoDB.put(params).promise();
      res.send(params.Item);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
