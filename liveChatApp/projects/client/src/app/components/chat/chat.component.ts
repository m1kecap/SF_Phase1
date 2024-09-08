import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class ChatComponent implements OnInit {
  channelName: string = '';
  message: string = '';

  constructor(private route: ActivatedRoute, private groupService: GroupService) {}

  ngOnInit() {
    const groupId = Number(this.route.snapshot.paramMap.get('groupId'));
    const channelId = Number(this.route.snapshot.paramMap.get('channelId'));
  
    // fetch group by id to get group name and channel name
    this.groupService.getGroupById(groupId).subscribe(group => {
      const channel = group.channels.find((ch: any) => ch.id === channelId);
      if (channel) {
        this.channelName = `Group ${group.name} - Channel ${channel.name}`;
      }
    });
  }
  
}
