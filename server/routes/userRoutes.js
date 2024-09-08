const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../data/users.json');
const { readGroupsFile } = require('./groupRoutes');

const readUsersFile = (callback) => {
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) throw err;
    callback(JSON.parse(data || '[]'));
  });
};

const writeUsersFile = (users, callback) => {
  fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8', callback);
};


exports.getUsers = (req, res) => {
  readUsersFile(users => {
    res.json(users);
  });
};


exports.updateUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;

  readUsersFile(users => {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedUser };
      writeUsersFile(users, () => {
        res.json(users[userIndex]);
      });
    }
  });
};


exports.deleteUser = (req, res) => {
  const userId = parseInt(req.params.id);

  readUsersFile(users => {
    const updatedUsers = users.filter(user => user.id !== userId);
    writeUsersFile(updatedUsers, () => {
      res.json({ success: true });
    });
  });
};


exports.getUserGroups = (req, res) => {
  const userId = parseInt(req.params.userId);

  readUsersFile(users => {
    const user = users.find(u => u.id === userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    readGroupsFile(groups => {
      const userGroups = groups.filter(group => group.members.includes(userId));
      res.json(userGroups);
    });
  });
};

exports.registerUser = (req, res) => {
    const { username, email, password } = req.body;
  
    readUsersFile(users => {
      const userExists = users.find(u => u.username === username);
      if (userExists) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      const newUser = {
        id: Date.now(),
        username,
        email,
        password, 
        roles: ['User']
      };
  
      users.push(newUser);
  
      writeUsersFile(users, () => {
        res.status(201).json(newUser);
      });
    });
  };
  
  
exports.createUserByAdmin = (req, res) => {
    const { username, email } = req.body;
  
    readUsersFile(users => {
      const userExists = users.find(u => u.username === username);
      if (userExists) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      const newUser = {
        id: Date.now(),
        username,
        email,
        password: '123', // default password for new users
        roles: ['User']
      };
  
      users.push(newUser);
  
      writeUsersFile(users, () => {
        res.status(201).json(newUser);
      });
    });
  };
  
