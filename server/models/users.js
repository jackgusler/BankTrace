const dynamoDB = require('./dynamoDB');

/**
 * @returns {User[]} An array of users.
 */
async function getAll() {
  const col = await dynamoDB.scan({
    TableName: 'Users',
  }).promise();
  return col.Items || [];
}

/**
 * @param {number} id - The users ID.
 */
async function get(id) {
  const col = await dynamoDB.scan({
    TableName: 'Users',
    FilterExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': id,
    },
  }).promise();
  return col.Items[0];
}

async function search(query) {
  const data = await dynamoDB.scan({
    TableName: 'Users',
  }).promise();
  return data.users.filter(x => {
    return (
      x.name.toLowerCase().includes(query.toLowerCase()) ||
      x.email.toLowerCase().includes(query.toLowerCase()) ||
      x.username.toLowerCase().includes(query.toLowerCase()) 
    );
  });
}

/**
 * @param {BaseUser} values - The user to create.
 * @returns {User} The created user.
 */
async function create(values) {
  const users = await getAll()
  const length = users.length
  const col = await dynamoDB.put({
    TableName: 'Users',
    Item: {
      id: length + 1,
      ...values,
    },
  }).promise();
  return {
    id: length + 1,
    ...values,
  }
}

/**
 * @param {string} email
 * @param {string} password
 * @returns {User} The created user.
 */
async function login(email, password) {
  const col = await dynamoDB.scan({
    TableName: 'Users',
    FilterExpression: 'email = :email AND password = :password',
    ExpressionAttributeValues: {
      ':email': email,
      ':password': password,
    },
  }).promise();
  return col.Items[0] || null;
}

/**
 * @param {User} newValues - The user's new data.
 * @returns {User} The updated user.
 */
async function update(newValues) {
  const col = await dynamoDB.update({
    TableName: 'Users',
    Key: {
      id: newValues.id,
    },
    UpdateExpression: 'set #name = :name, email = :email, username = :username, password = :password',
    ExpressionAttributeNames: {
      '#name': 'name',
    },
    ExpressionAttributeValues: {
      ':name': newValues.name,
      ':email': newValues.email,
      ':username': newValues.username,
      ':password': newValues.password,
      ':MonthlyData': newValues.MonthlyData,
    },
  }).promise();
  
  return newValues;
}

/**
 * @param {number} id - The user's ID.
 */
async function remove(id) {
  const col = await dynamoDB.delete({
    TableName: 'Users',
    Key: {
      id,
    },
  }).promise();
}


module.exports = {
  getAll, get, search, create, update, remove, login
};