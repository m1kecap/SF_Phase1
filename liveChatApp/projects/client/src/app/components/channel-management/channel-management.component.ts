import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../services/group.service';
import { Channel } from '../../models/channel.model';


@Component({
  selector: 'app-channel-management',
  templateUrl: './channel-management.component.html',
  styleUrls: ['./channel-management.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ChannelManagementComponent implements OnInit {
  selectedGroup: any = null;
  newChannelName: string = '';
  groupId: number = 0;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.groupId = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.loadGroup();
  }

  loadGroup() {
    this.groupService.getGroupById(this.groupId).subscribe(group => {
      this.selectedGroup = group;
    });
  }

  createChannel() {
    if (this.newChannelName.trim() && this.selectedGroup) {
      const newChannel: Channel = { id: Date.now(), name: this.newChannelName };
      this.selectedGroup.channels.push(newChannel);
      this.saveGroup();
      this.newChannelName = '';
    }
  }

  deleteChannel(channelId: number) {
    if (this.selectedGroup) {
      this.selectedGroup.channels = this.selectedGroup.channels.filter(
        (channel: Channel) => channel.id !== channelId
      );
      this.saveGroup();
    }
  }

  saveGroup() {
    if (this.selectedGroup) {
      this.groupService.updateGroup(this.groupId, this.selectedGroup).subscribe(group => {
        this.selectedGroup = group;  // update the local group
      });
    }
  }
}

