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

async function query(query) {
  const col = await dynamoDB.scan({
    TableName: 'Users',
    FilterExpression: 'contains(#email, :email)',
    ExpressionAttributeNames: {
      '#email': 'email',
    },
    ExpressionAttributeValues: {
      ':email': query,
    },
  }).promise();
  return col.Items;
}

/**
 * @param {BaseUser} values - The user to create.
 * @returns {User} The created user.
 */
async function create(values) {
  const users = await getAll()
  const length = users.length
  const userCheck = await query(values.email)
  if (userCheck.length > 0) {
    return null
  }
  const col = await dynamoDB.put({
    TableName: 'Users',
    Item: {
      id: String(length + 1),
      ...values,
    },
  }).promise();
  return {
    id: String(length + 1),
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
    UpdateExpression: 'set #name = :name, email = :email, password = :password, monthlyData = :monthlyData',
    ExpressionAttributeNames: {
      '#name': 'name',
    },
    ExpressionAttributeValues: {
      ':name': newValues.name,
      ':email': newValues.email,
      ':password': newValues.password,
      ':monthlyData': newValues.monthlyData, // Use consistent case here
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
  getAll, get, query, create, update, remove, login
};