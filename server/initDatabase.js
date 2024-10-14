const mongoose = require('mongoose');
const User = require('./models/User');
const Group = require('./models/Group');

const initialUsers = [
  {
    id: Date.now(),
    username: "super",
    email: "admin@com.au",
    password: "123",
    roles: ["Super Admin"]
  },
  {
    id: Date.now() + 1,
    username: "group",
    email: "group@mail.com",
    password: "123",
    roles: ["User", "Group Admin"]
  },
  {
    id: Date.now() + 2,
    username: "user",
    email: "user@com.au",
    password: "123",
    roles: ["User"]
  }
];

async function initDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Group.deleteMany({});

    // Insert initial users
    await User.insertMany(initialUsers);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error; // Rethrow the error so it can be caught in server.js
  }
}

module.exports = initDatabase;