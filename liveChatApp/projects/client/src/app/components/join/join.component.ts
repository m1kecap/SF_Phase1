import { Component, OnInit  } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class JoinComponent implements OnInit {
  userId: number = 0;
  groups: any[] = [];

  constructor(
    private groupService: GroupService
  ) {}

  ngOnInit() {
      this.userId = Number(sessionStorage.getItem('userid'));
      this.loadGroups();
  }

  loadGroups() {
    this.groupService.getGroups().subscribe(groups => {
      this.groups = groups;
    });
  }

  registerInterest(groupId: number) {
    this.groupService.addInterestToGroup(groupId, this.userId).subscribe({
      next: response => {
        alert('Interest requested successfully');
      },
      error: error => {
        console.error('Error:', error);
      }
    });
  }
}
