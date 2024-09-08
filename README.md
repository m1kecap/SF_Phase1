# LiveChatApp Phase 1 Documentation by Nhat Anh Cap - s5215692


Client-Server Interaction

- **Server**: The backend code is located in the `/server` folder. It contains:
  - `/routes`: Defines all the server routes for handling users, groups, and channel such as `groupRoutes.js`, `postLogin.js`, `userRoutes.js`
  - `/data`: JSON files (`users.json`, `groups.json`) for storing data.
  - `server.js`: The main NodeJS server file that manages the Express routes and server configuration.

- **Client**: The frontend Angular code is located in the `/projects/client` folder. It contains:
  - `/app/components`: Angular components like `login`, `register`, `dashboard`, `chat`, `user-management`, `channel-management`, `group-management`, `join`.
  - `/app/services`: Angular services like `auth.service.ts`, `group.service.ts`, `user.service.ts` and `auth.guard.ts` for communication with the backend.


## Data Structures

Client side:
- **User**: users interact with app
export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    roles: string[];
    groups?: Group[];
    channels?: Channel[];
}

- **Group**: chat group
export interface Group {
    id: number;
    name: string;
    channels: Channel[];
    admins: number[];
    members: number[];
}

- **Channel**: channels inside chat group
export interface Channel {
    id: number;
    name: string;

}

Server side:
- **User object**: stored in `server/data/users.json`:
{
    "id": 1,
    "username": "super",
    "email": "admin@com.au",
    "password": "123",
    "roles": ["Super Admin"]
}

- **Group object**: stored  in `server/data/groups.json`:
{
    "id": 123456,
    "name": "Group Name",
    "channels": [],
    "admins": [],
    "members": []
}

### Angular Architecture
- **Components**:
. LoginComponent: handles user login.
. RegisterComponent: handles user registration.
. DashboardComponent: displays a list of groups and channels of that specific user and allows user to join chat channel of the group. (Super Admin will see all the groups and channels)
. UserManagementComponent: allows Super Admin to manage users (create, promote, delete).
. GroupManagementComponent: allows Super Admin and Group Admin to manages group creation, deletion, and memberships. 
. ChannelManagementComponent: manages channel creation and deletion within its group.
. ChatComponent: provides a UI for chatting within a channel (no functionality).
. JoinComponent: allows users to request interests to join groups.

- **Services**:
. AuthService: manages authentication, login, logout, and role-based access.
. UserService: handles user-related actions, such as fetching users and registering new users.
. GroupService: handles group-related actions such as fetching, creating, updating, and deleting groups and adding/removing users from groups.
. AuthGuard: protects routes based on user roles. Making sure only users with required roles can access to certain parts of the app.

- **Models**:
. User model: represents users in the application.
. Group model: represents groups that contain channels and members.
. Channel model: represents individual channels within a group.

- **Routes**:
Routes
- App Routes: defines the navigation flow between different parts of the app:
. /login: for user login.
. /register: for user registration.
. /dashboard: user dashboard displaying groups and channels.
. /groups: manage groups for admins.
. /channels/:id: manage channels within a group.
. /users: manage users for Super Admin.
. /join: request to join a group.
. /channel/:groupId/:channelId: access the chat within a channel.


#### Node.js Server Architecture
- **Modules and Files**:
. Server.js: main entry point for the Node.js server. Sets up routes for user and group management and listens on port 8080.
. Group Routes (groupRoutes.js): handles all group-related operations such as creating, updating, deleting, adding/removing users, and approving join requests.
. User Routes (userRoutes.js): manages user-related operations such as registering, updating, and deleting users.
. PostLogin.js: handles the login route logic by verifying users with the users.json file.

- **Global Variables**
. Users File Path: const usersFilePath = path.join(__dirname, '../data/users.json');
. Groups File Path: const groupsFilePath = path.join(__dirname, '../data/groups.json');

##### REST API Routes

**Server Side Routes**

- User Routes:
. POST /login: logs a user in by checking the users.json file for valid credentials.
    + Parameters: username, password
    + Return: Uuser object with roles and ID.
. POST /register: registers a new user.
    + Parameters: username, email, password
    + Return: newly created user object.
. GET /users: retrieves all users.
    + Return: list of all users.
. PUT /users/:id: updates user data.
    + Parameters: id (user ID)
    + Return: updated user object.
. DELETE /users/:id: deletes a user.
    + Parameters: id (user ID)
    + Return: success message.

- Group Routes:
. GET /groups: Fetches all groups.
    + Return: List of all groups.
. POST /groups: Creates a new group.
    + Parameters: name, adminId
    + Return: Newly created group object.
. GET /groups/:id: Fetches a specific group by ID.
    + Parameters: id (group ID)
    + Return: Group object.
. PUT /groups/:id: Updates a group (e.g., add channels).
    + Parameters: id (group ID)
    + Return: Updated group object.
. DELETE /groups/:id: Deletes a group.
    + Parameters: id (group ID), adminId, isSuperAdmin
    + Return: Success message.
. POST /groups/:id/add-user: Adds a user to a group.
    + Parameters: userId, groupId
    + Return: Updated group object.
. POST /groups/:id/remove-user: Removes a user from a group.
    + Parameters: userId, groupId
    + Return: Updated group object.

###### Client and Server Interaction
**Login**:
- The user inputs their username and password in the LoginComponent to log in.
- Then the credentials are sent to the server via AuthService to the POST /login route.
- If credentials valid, the server responds with user data (roles, ID), which is stored in sessionStorage, and the user is navigated to the dashboard.

**Group Management**:
- In the GroupManagementComponent, admins can create groups by entering a name and submitting the form, which calls GroupService.createGroup().
- The new group is sent to POST /groups on the server, and the updated group list is fetched and displayed.

**Channel Management**:
- Admins create and delete channels in the ChannelManagementComponent.
- Channels are added via createChannel() and sent to PUT /groups/:id on the server to update the group.

**User Management**:
- The UserManagementComponent allows Super Admins to create, delete, or promote users.
- When creating a user, the form calls UserService.register(), which sends the user data to POST /users.
- Promoting users is done by calling UserService.updateUser() and passing updated role information to PUT /users/:id.

####### For Git repository
Hi Professor, during working on Phase 1, I attempted to use Git for version control and repository management. But while working on components and services interaction into the app, I got conflicts from push and pull repo that affected the project's structure. Then I tried to tide it up and re-do again and somehow it brings me to a loop. By saving time to do the assignment phase 1 and other assignments at the same time, I decided to pass on the Git version control. In Phase 2, I will be well orgranize the repository, same with branching and frequent commits. 

