const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../data/users.json');

module.exports = function(req, res) {
  const { username, password } = req.body;

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const users = JSON.parse(data);
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      res.status(401).json({ ok: false, message: 'Wrong username or password' });
    } else {
      res.json({
        ok: true,
        id: user.id,
        username: user.username,
        roles: user.roles
      });
    }
  });
};
