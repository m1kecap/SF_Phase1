const User = require('../models/User');
const Group = require('../models/Group');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { $set: req.body },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.deleteOne({ id: parseInt(req.params.id) });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const user = await User.findOne({ id: parseInt(req.params.userId) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userGroups = await Group.find({ members: user.id });
    res.json(userGroups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = new User({
      id: Date.now(),
      username,
      email,
      password,
      roles: ['User']
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createUserByAdmin = async (req, res) => {
  const { username, email } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = new User({
      id: Date.now(),
      username,
      email,
      password: '123', // default password for new users
      roles: ['User']
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUserProfileImage = async (req, res) => {
  try {
    const user = await User.findOne({ id: parseInt(req.params.userId) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.profileImage || '');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserProfileImage = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { id: parseInt(req.params.userId) },
      { $set: { profileImage: req.body.profileImage } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, profileImage: updatedUser.profileImage });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};