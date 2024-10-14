const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { ExpressPeerServer } = require('peer');
const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
});

const PORT = 8080;
const connectDB = require('./database');
const postLogin = require('./routes/postLogin');
const groupRoutes = require('./routes/groupRoutes');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User');
const Message = require('./models/Message');
const initDatabase = require('./initDatabase');

// Set up PeerServer
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/myapp'
});

app.use('/peerjs', peerServer);

app.use('/images', express.static(path.join(__dirname, 'userimages')));
app.use('/assets', express.static(path.join(__dirname, '../client/src/assets')));

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

require('./routes/uploads')(app);

async function startServer() {
  try {
    await connectDB();
    console.log('MongoDB connected successfully');

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database is empty. Initializing...');
      await initDatabase();
    } else {
      console.log('Database already contains data.');
    }

    // Routes
    app.post('/login', postLogin);

    // Group management routes
    app.get('/groups', groupRoutes.getGroups);
    app.post('/groups', groupRoutes.createGroup);
    app.get('/groups/:id', groupRoutes.getGroupById);
    app.delete('/groups/:id', groupRoutes.deleteGroup);
    app.put('/groups/:id', groupRoutes.updateGroup);
    app.post('/groups/:id/add-user', groupRoutes.addUserToGroup);
    app.post('/groups/:id/remove-user', groupRoutes.removeUserFromGroup);
    app.post('/groups/:id/register-interest', groupRoutes.registerInterest);
    app.post('/groups/:id/approve-interest', groupRoutes.approveUserInterest);

    // User management routes
    app.get('/users', userRoutes.getUsers);
    app.put('/users/:id', userRoutes.updateUser);
    app.delete('/users/:id', userRoutes.deleteUser);
    app.get('/users/:userId/groups', userRoutes.getUserGroups);
    app.post('/users/register', userRoutes.registerUser);
    app.post('/users', userRoutes.createUserByAdmin);
    app.get('/users/:userId/profile-image', userRoutes.getUserProfileImage);
    app.put('/users/:userId/profile-image', userRoutes.updateUserProfileImage);

    // Socket.io
    io.on('connection', (socket) => {
      let currentUser = null;
    
      socket.on('joinChannel', async (channelId, userId) => {
        try {
          currentUser = await User.findOne({ id: userId });
          if (currentUser) {
            socket.join(channelId);
            io.to(channelId).emit('userJoined', {
              username: currentUser.username,
              profileImage: currentUser.profileImage
            });
    
            // Load previous messages
            const messages = await Message.find({ channelId }).sort({ timestamp: 1 }).limit(50);
            socket.emit('loadMessages', messages);
          }
        } catch (error) {
          console.error('Error finding user:', error);
        }
      });
    
      socket.on('leaveChannel', (channelId) => {
        if (currentUser) {
          socket.leave(channelId);
          io.to(channelId).emit('userLeft', {
            username: currentUser.username,
            profileImage: currentUser.profileImage
          });
        }
      });

      socket.on('chatMessage', async ({ channelId, message, userId, username, imagePath }) => {
        console.log('Received chat message:', { channelId, message, userId, username, imagePath });
        try {
          const user = await User.findOne({ id: userId });
          const newMessage = new Message({
            channelId,
            userId,
            username,
            content: message || ' ',  // Use a space if message is empty
            imageUrl: imagePath,
            userProfileImage: user.profileImage
          });
          await newMessage.save();
      
          const emittedMessage = {
            _id: newMessage._id,
            channelId: newMessage.channelId,
            userId: newMessage.userId,
            username: newMessage.username,
            content: newMessage.content,
            timestamp: newMessage.timestamp,
            imageUrl: newMessage.imageUrl,
            userProfileImage: newMessage.userProfileImage
          };
          console.log('Emitting message:', emittedMessage);
          io.to(channelId).emit('message', emittedMessage);
        } catch (error) {
          console.error('Error saving message:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
        if (currentUser) {
          socket.rooms.forEach((room) => {
            io.to(room).emit('userLeft', currentUser.username);
          });
        }
      });

      socket.on('newUser', (userId, peerId) => {
        socket.broadcast.emit('userConnected', { userId, peerId });
      });
    
    });

    // Start the server
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();