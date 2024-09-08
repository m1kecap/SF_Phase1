const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

const postLogin = require('./routes/postLogin');
const groupRoutes = require('./routes/groupRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use(cors());

app.post('/login', postLogin);

// group management routes
app.get('/groups', groupRoutes.getGroups);
app.get('/groups/:id', groupRoutes.getGroupById);
app.post('/groups', groupRoutes.createGroup);
app.delete('/groups/:id', groupRoutes.deleteGroup);
app.put('/groups/:id', groupRoutes.updateGroup);
app.post('/groups/:id/add-user', groupRoutes.addUserToGroup);
app.post('/groups/:id/remove-user', groupRoutes.removeUserFromGroup);
app.post('/groups/:id/register-interest', groupRoutes.registerInterest);
app.post('/groups/:id/approve-interest', groupRoutes.approveUserInterest);


// user management routes
app.get('/users', userRoutes.getUsers);
app.post('/register', userRoutes.registerUser);
app.post('/users', userRoutes.createUserByAdmin);
app.put('/users/:id', userRoutes.updateUser);
app.delete('/users/:id', userRoutes.deleteUser);
app.get('/users/:userId/groups', userRoutes.getUserGroups);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
