import { Component, OnInit  } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user.model'; 

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule]
})
export class GroupManagementComponent implements OnInit {
  userGroups: any[] = [];
  newGroupName: string = '';
  isSuperAdmin: boolean = false;
  userId: number = 0;
  selectedUserId: number | null = null;
  users: User[] = []; 

  constructor(
    private groupService: GroupService,
    private userService: UserService, 
    private authService: AuthService
  ) {}

  ngOnInit() {
      this.userId = Number(sessionStorage.getItem('userid'));
      this.isSuperAdmin = this.authService.isSuperAdmin();
      this.loadGroups();
      this.loadUsers(); 
  }

  loadGroups() {
    this.groupService.getGroups().subscribe(groups => {
      console.log('Loaded groups:', groups);  // Add this line
      if (this.isSuperAdmin) {
        this.userGroups = groups;
      } else {
        this.userGroups = groups.filter(group => group.adminId === this.userId || group.admins.includes(this.userId));
      }
      console.log('Filtered user groups:', this.userGroups);  // Add this line
    });
  }
  
  

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    }, error => {
      console.error('Failed to load users:', error);
    });
  }

  createGroup() {
    if (this.newGroupName.trim()) {
      const newGroup = { name: this.newGroupName, channels: [], adminId: this.userId };
      this.groupService.createGroup(newGroup).subscribe(group => {
        this.userGroups.push(group);
        this.newGroupName = '';  
      });
    }
  }

  deleteGroup(groupId: number) {
    this.groupService.deleteGroup(groupId, this.userId, this.isSuperAdmin).subscribe(() => {
        this.userGroups = this.userGroups.filter(group => group.id !== groupId);
    }, error => {
        console.error("Error:", error);
    });
  }

  addUserToGroup(userId: number | null, groupId: number) {
    if (userId === null) {
      alert('Please select a user');
      return;
    }
    this.groupService.addUserToGroup(Number(userId), groupId).subscribe({
      next: response => {
        console.log('User is added', response);
        this.loadGroups(); 
      },
      error: error => console.error('Error adding user to group', error)
    });
  }

  removeUserFromGroup(userId: number, groupId: number) {
    this.groupService.removeUserFromGroup(userId, groupId).subscribe(() => {
      this.loadGroups(); 
    });
  }

  approveUser(userId: number, groupId: number) {
    this.groupService.approveUserInterest(groupId, userId).subscribe({
      next: (response: any) => {
        this.loadGroups(); 
        alert('User approved and added to group');
      },
      error: (error: any) => {
        console.error('Error approving user', error);
      }
    });
  }
  
  
}