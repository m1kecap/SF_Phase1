const fs = require('fs');
const path = require('path');
const groupsFilePath = path.join(__dirname, '../data/groups.json');

const readGroupsFile = (callback) => {
  fs.readFile(groupsFilePath, 'utf8', (err, data) => {
    if (err) throw err;
    callback(JSON.parse(data || '[]'));
  });
};
exports.readGroupsFile = readGroupsFile;

const writeGroupsFile = (groups, callback) => {
  fs.writeFile(groupsFilePath, JSON.stringify(groups, null, 2), 'utf8', callback);
};

exports.getGroups = (req, res) => {
  readGroupsFile(groups => {
    res.json(groups);
  });
};

exports.createGroup = (req, res) => {
    const newGroup = req.body;
    readGroupsFile(groups => {
      newGroup.id = Date.now();
      newGroup.admin = req.body.adminId; 
      newGroup.members = [req.body.adminId]; 
      groups.push(newGroup);
      writeGroupsFile(groups, () => {
        res.json(newGroup);
      });
    });
  };


exports.getGroupById = (req, res) => {
    const groupId = parseInt(req.params.id);
    readGroupsFile(groups => {
      const group = groups.find(group => group.id === groupId);
      if (group) {
        res.json(group);
      } else {
        res.status(404).json({ message: 'Group not found' });
      }
    });
  };
  

  exports.deleteGroup = (req, res) => {
    const groupId = parseInt(req.params.id);
    const adminId = parseInt(req.query.adminId); 
    const isSuperAdmin = req.query.isSuperAdmin === 'true'; 
  
    readGroupsFile(groups => {
      const group = groups.find(g => g.id === groupId);
      if (group) {
        if (isSuperAdmin || group.admin === adminId) {
          const updatedGroups = groups.filter(g => g.id !== groupId);
          writeGroupsFile(updatedGroups, () => {
            res.status(200).json({ success: true, message: "Group deleted successfully." });
          });
        } 
      } 
    });
};
  
exports.updateGroup = (req, res) => {
    const groupId = parseInt(req.params.id);
    const updatedGroup = req.body;
  
    readGroupsFile(groups => {
      const groupIndex = groups.findIndex(group => group.id === groupId);
      if (groupIndex !== -1) {
        groups[groupIndex] = { ...groups[groupIndex], ...updatedGroup };
        writeGroupsFile(groups, () => {
          res.json(groups[groupIndex]);
        });
      }
    });
  };
  

exports.addUserToGroup = (req, res) => {
    const groupId = parseInt(req.params.id);
    const userId = req.body.userId; 
  
    readGroupsFile(groups => {
      const group = groups.find(g => g.id === groupId);
      if (group) {
        if (!group.members.includes(userId)) {
          group.members.push(userId);
        }
        writeGroupsFile(groups, () => {
          res.json(group);
        });
      }
    });
  };
  
  
  exports.removeUserFromGroup = (req, res) => {
    const groupId = parseInt(req.params.id);
    const userId = req.body.userId; 
  
    readGroupsFile(groups => {
      const group = groups.find(g => g.id === groupId);
      if (group) {
        group.members = group.members.filter(id => id !== userId);
        writeGroupsFile(groups, () => {
          res.json(group);
        });
      }
    });
  };

  
exports.registerInterest = (req, res) => {
    const groupId = parseInt(req.params.id);
    const userId = req.body.userId; 
  
    readGroupsFile(groups => {
      const group = groups.find(g => g.id === groupId);
      if (group) {
        if (!group.interestedUsers) {
          group.interestedUsers = []; 
        }
        if (!group.interestedUsers.includes(userId) && !group.members.includes(userId)) {
          group.interestedUsers.push(userId);
        }
        writeGroupsFile(groups, () => {
          res.json({ success: true, message: 'Interest registered successfully', group });
        });
      }
    });
  };
  

exports.approveUserInterest = (req, res) => {
    const groupId = parseInt(req.params.id);
    const userId = req.body.userId;
  
    readGroupsFile(groups => {
      const group = groups.find(g => g.id === groupId);
      if (group) {
        group.interestedUsers = group.interestedUsers.filter(id => id !== userId);
        if (!group.members.includes(userId)) {
          group.members.push(userId);
        }
        writeGroupsFile(groups, () => {
          res.json(group);
        });
      }
    });
  };
  
  