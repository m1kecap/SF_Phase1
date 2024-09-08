import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GroupManagementComponent } from './components/group-management/group-management.component';
import { ChannelManagementComponent } from './components/channel-management/channel-management.component';
import { ChatComponent } from './components/chat/chat.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AuthGuard } from './services/auth.guard'; 
import { JoinComponent } from './components/join/join.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent},  
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['User', 'Group Admin', 'Super Admin'] }},
  { path: 'join', component: JoinComponent, canActivate: [AuthGuard], data: { roles: ['User', 'Group Admin'] }},
  
  // group management for admins
  { 
    path: 'groups', 
    component: GroupManagementComponent, 
    canActivate: [AuthGuard], 
    data: { roles: ['Super Admin', 'Group Admin'] }  
  },  

  // user management for only super admin
  { 
    path: 'users', 
    component: UserManagementComponent, 
    canActivate: [AuthGuard], 
    data: { roles: ['Super Admin'] }  
  },

  { 
    path: 'channel/:groupId/:channelId', 
    component: ChatComponent, 
    canActivate: [AuthGuard], 
    data: { roles: ['User', 'Group Admin', 'Super Admin'] }
  },

  // channel management for admins
  { 
    path: 'channels/:id', 
    component: ChannelManagementComponent, 
    canActivate: [AuthGuard], 
    data: { roles: ['Super Admin', 'Group Admin'] }  
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'login', pathMatch: 'full' } 
];
