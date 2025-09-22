// controllers/users.js
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
//#swagger.tags['users']
  try {
    const cursor = await mongodb.getDatabase().db().collection('users').find();
    const users = await cursor.toArray();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(users);
  } catch (err) {
    console.error('getAll error:', err);
    return res.status(500).json({ message: 'Could not get users.' });
  }
};

const getSingle = async (req, res) => {
//#swagger.tags['users']
  try {
    const id = req.params.id;
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const userId = new ObjectId(id);
    const user = await mongodb.getDatabase().db().collection('users').findOne({ _id: userId });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(user);
  } catch (err) {
    console.error('getSingle error:', err);
    return res.status(500).json({ message: 'Could not get user.' });
  }
};

// Accept any non-empty JSON body and insert it.
// Returns 201 with the new document id.
const createUser = async (req, res) => {
//#swagger.tags['users']
  try {
    const user = req.body;
    if (!user || Object.keys(user).length === 0) {
      return res.status(400).json({ message: 'Missing request body' });
    }

    const response = await mongodb.getDatabase().db().collection('users').insertOne(user);

    if (response.acknowledged) {
      return res.status(201).json({ id: response.insertedId });
    } else {
      return res.status(500).json({ message: 'Could not create user' });
    }
  } catch (err) {
    console.error('createUser error:', err);
    return res.status(500).json({ message: 'Could not create user.' });
  }
};

// Partial update: update any fields provided in req.body using $set.
// Returns 204 on success, 404 if id not found.
const updateUser = async (req, res) => {
//#swagger.tags['users']
  try {
    const id = req.params.id;
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const userId = new ObjectId(id);
    const updateBody = req.body;

    if (!updateBody || Object.keys(updateBody).length === 0) {
      return res.status(400).json({ message: 'Missing request body' });
    }

    const response = await mongodb
      .getDatabase()
      .db()
      .collection('users')
      .updateOne({ _id: userId }, { $set: updateBody });

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // success (204 No Content)
    return res.status(204).send();
  } catch (err) {
    console.error('updateUser error:', err);
    return res.status(500).json({ message: 'Could not update user.' });
  }
};

const deleteUser = async (req, res) => {
//#swagger.tags['users']
  try {
    const id = req.params.id;
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const userId = new ObjectId(id);

    const response = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(204).send();
  } catch (err) {
    console.error('deleteUser error:', err);
    return res.status(500).json({ message: 'Could not delete user.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser
};
