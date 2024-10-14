import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../services/group.service';
import { SocketService } from '../../services/socket.service';
import { AuthService } from '../../services/auth.service';
import { ImageUploadService } from '../../services/image-upload.service';
import { UserService } from '../../services/user.service';
import { PeerService } from '../../services/peer.service';
import { Subscription } from 'rxjs';
import { VideoChatComponent } from '../video-chat/video-chat.component';


interface ChatMessage {
  _id: string;
  channelId: string;
  userId: number;
  username: string;
  content: string;
  timestamp: Date;
  system?: boolean;
  imageUrl?: string;
  userProfileImage?: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, VideoChatComponent]
})
export class ChatComponent implements OnInit, OnDestroy {
  channelName: string = '';
  message: string = '';
  messages: ChatMessage[] = [];
  groupId!: number;
  channelId!: number;
  private subscriptions: Subscription[] = [];
  selectedFile: File | null = null;
  selectedProfileImage: File | null = null;
  currentUserProfileImage: string = '/assets/default-avatar.png';
  defaultAvatarPath = 'assets/default-avatar.png';
  showVideoChat: boolean = false;
  myPeerId: string = '';
  remotePeerId: string = '';
  userId: number;
  isReceivingCall: boolean = false;
  incomingCallerId: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef;


  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private socketService: SocketService,
    private authService: AuthService,
    private imageUploadService: ImageUploadService,
    private userService: UserService,
    private peerService: PeerService
  ) {this.userId = this.authService.getUserId();}

  ngOnInit() {
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId'));
    this.channelId = Number(this.route.snapshot.paramMap.get('channelId'));
    this.loadCurrentUserProfileImage();
  
    this.groupService.getGroupById(this.groupId).subscribe(group => {
      const channel = group.channels.find((ch: any) => ch.id === this.channelId);
      if (channel) {
        this.channelName = `Group ${group.name} - Channel ${channel.name}`;
        this.joinChannel();
      }
    });

        // listening for messages, user joins, and user leaves through the socket service
    const messageSub = this.socketService.onMessage().subscribe((message: ChatMessage) => {
      this.messages.push(message);
    });

    const userJoinedSub = this.socketService.onUserJoined().subscribe(data => {
      console.log(`User ${data.username} joined the channel`);
      this.messages.push({
        _id: Date.now().toString(),
        channelId: this.channelId.toString(),
        userId: 0,
        username: 'System',
        content: `${data.username} joined the channel`,
        timestamp: new Date(),
        system: true
      });
    });

    const userLeftSub = this.socketService.onUserLeft().subscribe(data => {
      console.log(`User ${data.username} left the channel`);
      this.messages.push({
        _id: Date.now().toString(),
        channelId: this.channelId.toString(),
        userId: 0,
        username: 'System',
        content: `${data.username} left the channel`,
        timestamp: new Date(),
        system: true
      });
    });

    const loadedMessagesSub = this.socketService.onLoadMessages().subscribe((messages: ChatMessage[]) => {
      this.messages = messages;
    });

    this.subscriptions.push(messageSub, userJoinedSub, userLeftSub, loadedMessagesSub);

    // emitting user's peer ID for video calling
    this.peerService.myPeerId$.subscribe(peerId => {
      this.myPeerId = peerId;
      this.socketService.emit('newUser', this.userId, peerId);
    });

    this.socketService.on('userConnected').subscribe((data: {userId: string, peerId: string}) => {
      console.log(`User ${data.userId} connected with Peer ID: ${data.peerId}`);
    });
  }

  //join a chat channel based on the channelId
  joinChannel() {
    const userId = this.authService.getUserId();
    this.socketService.joinChannel(this.channelId.toString(), userId);
  }

  // triggered when a file is selected for upload, and same as profile image
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onProfileImageSelected(event: any) {
    this.selectedProfileImage = event.target.files[0];
  }

    // uploads the selected profile image and updates the user's profile image.
  uploadProfileImage() {
    if (this.selectedProfileImage) {
      this.imageUploadService.uploadImage(this.selectedProfileImage).subscribe(
        res => {
          console.log('Upload response:', res);
          const imagePath = res.data.path;
          const userId = this.authService.getUserId();
          this.userService.updateUserProfileImage(userId, imagePath).subscribe(
            () => {
              console.log('Profile image updated successfully');
              this.currentUserProfileImage = `http://localhost:8080${imagePath}`;
              this.selectedProfileImage = null;
            },
            err => {
              console.error('Error updating profile image:', err);
            }
          );
        },
        err => {
          console.error('Error uploading profile image:', err);
        }
      );
    }
  }
// load the current user's profile image from the server
  loadCurrentUserProfileImage() {
    const userId = this.authService.getUserId();
    this.userService.getUserProfileImage(userId).subscribe(
      imagePath => {
        this.currentUserProfileImage = imagePath ? `http://localhost:8080${imagePath}` : this.defaultAvatarPath;
      },
      error => console.error('Error loading profile image:', error)
    );
  }

  sendMessage() {
    if (this.message.trim() || this.selectedFile) {
      const userId = this.authService.getUserId();
      const username = this.authService.getUsername();
      const content = this.message.trim();

      if (this.selectedFile) {
        this.imageUploadService.uploadImage(this.selectedFile).subscribe(
          res => {
            console.log('Image upload response:', res);
            const imagePath = res.data.path;
            console.log('Sending message with image:', imagePath);
            this.socketService.sendMessage(this.channelId.toString(), content, userId, username, imagePath);
            this.selectedFile = null;
            this.message = '';
            this.resetFileInput();  
          },
          err => {
            console.error('Error uploading image:', err);
            if (content) {
              this.socketService.sendMessage(this.channelId.toString(), content, userId, username);
            }
            this.resetFileInput();  
          }
        );
      } else {
        this.socketService.sendMessage(this.channelId.toString(), content, userId, username);
        this.message = '';
      }
    }
  }

    // reset file input after uploading an image.
  resetFileInput() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  startVideoChat() {
    this.showVideoChat = true;
  }

  onVideoChatClosed() {
    this.showVideoChat = false;
  }

  ngOnDestroy() {
    this.socketService.leaveChannel(this.channelId.toString());
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}