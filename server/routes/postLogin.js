const User = require('../models/User');

module.exports = async function(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ ok: false, message: 'Wrong username or password' });
    }

    res.json({
      ok: true,
      id: user.id,
      username: user.username,
      roles: user.roles
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};