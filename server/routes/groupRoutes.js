const express = require('express');
const Group = require('../models/Group');

exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createGroup = async (req, res) => {
  const newGroup = new Group({
    id: Date.now(),
    name: req.body.name,
    channels: [],
    admins: [req.body.adminId],
    members: [req.body.adminId]
  });

  try {
    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findOne({ id: parseInt(req.params.id) });
    if (group) {
      res.json(group);
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteGroup = async (req, res) => {
  const groupId = parseInt(req.params.id);
  const adminId = parseInt(req.query.adminId);
  const isSuperAdmin = req.query.isSuperAdmin === 'true';

  try {
    const group = await Group.findOne({ id: groupId });
    if (group) {
      if (isSuperAdmin || group.admins.includes(adminId)) {
        await Group.deleteOne({ id: groupId });
        res.status(200).json({ success: true, message: "Group deleted successfully." });
      } else {
        res.status(403).json({ success: false, message: "Not authorized to delete this group." });
      }
    } else {
      res.status(404).json({ success: false, message: "Group not found." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const groupId = parseInt(req.params.id);
    const { channels, ...otherFields } = req.body;

    let updateOperation = { $set: otherFields };

    if (channels) {
      updateOperation.$set.channels = channels;
    }

    const updatedGroup = await Group.findOneAndUpdate(
      { id: groupId },
      updateOperation,
      { new: true, upsert: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(updatedGroup);
  } catch (err) {
    console.error('Error updating group:', err);
    res.status(400).json({ message: err.message });
  }
};

exports.addUserToGroup = async (req, res) => {
  try {
    const group = await Group.findOne({ id: parseInt(req.params.id) });
    if (group) {
      if (!group.members.includes(req.body.userId)) {
        group.members.push(req.body.userId);
        await group.save();
      }
      res.json(group);
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeUserFromGroup = async (req, res) => {
  try {
    const group = await Group.findOne({ id: parseInt(req.params.id) });
    if (group) {
      group.members = group.members.filter(id => id !== req.body.userId);
      await group.save();
      res.json(group);
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.registerInterest = async (req, res) => {
  try {
    const group = await Group.findOne({ id: parseInt(req.params.id) });
    if (group) {
      if (!group.interestedUsers) {
        group.interestedUsers = [];
      }
      if (!group.interestedUsers.includes(req.body.userId) && !group.members.includes(req.body.userId)) {
        group.interestedUsers.push(req.body.userId);
        await group.save();
      }
      res.json({ success: true, message: 'Interest registered successfully', group });
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveUserInterest = async (req, res) => {
  try {
    const group = await Group.findOne({ id: parseInt(req.params.id) });
    if (group) {
      group.interestedUsers = group.interestedUsers.filter(id => id !== req.body.userId);
      if (!group.members.includes(req.body.userId)) {
        group.members.push(req.body.userId);
      }
      await group.save();
      res.json(group);
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};