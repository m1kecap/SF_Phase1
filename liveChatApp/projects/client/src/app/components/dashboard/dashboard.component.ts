import { Component, OnInit,  } from '@angular/core';
import {  CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  isSuperAdmin: boolean = false;
  isAdmin: boolean = false;
  userGroups: any[] = [];  
  userId: number = 0;

  constructor(
    private router: Router,
    private groupService: GroupService,
    private userService: UserService,
    private authService: AuthService,
    
  ) {}

  ngOnInit() {
      this.checkRoles();
      this.loadUserGroups();
    
  }

  checkRoles() {
    const roles = JSON.parse(sessionStorage.getItem('roles') || '[]');
    this.isSuperAdmin = roles.includes('Super Admin');
    this.isAdmin = roles.includes('Group Admin') || this.isSuperAdmin;
    this.userId = Number(sessionStorage.getItem('userid'));
  }

  deleteAccount() {
    this.userService.deleteUser(this.userId).subscribe({
      next: () => {
        this.authService.logout(); 
        this.router.navigate(['/login']); 
      },
      error: error => {
        console.error('Error:', error);
      }
    });
  }
  
 
  loadUserGroups() {
    if (this.isSuperAdmin) {
      this.groupService.getGroups().subscribe(groups => {
        this.userGroups = groups;
      });
    } else {
      this.userService.getUserGroups(this.userId).subscribe(groups => {
        this.userGroups = groups;
      });
    }
  }
  
  leaveGroup(groupId: number) {
    if (confirm('Are you sure you want to leave this group?')) {
      this.groupService.removeUserFromGroup(this.userId, groupId).subscribe({
        next: () => {
          alert('You left the group');
          this.loadUserGroups(); 
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
    }
  }
  

  joinChannel(groupId: number, channelId: number) {
    this.router.navigate([`/channel/${groupId}/${channelId}`]);
  }


}

