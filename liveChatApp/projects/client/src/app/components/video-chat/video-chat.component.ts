import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { PeerService } from '../../services/peer.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class VideoChatComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
  @Output() closeVideoChat = new EventEmitter<void>();

  remotePeerId: string = ''; // remote user peer id
  myPeerId: string = ''; // current user peer id
  localStream: MediaStream | null = null;
  currentCall: any = null;
  isReceivingCall: boolean = false;
  incomingCallPeerId: string = '';

  constructor(private peerService: PeerService) {}

  ngOnInit() {
    this.setupLocalVideo();
    this.handleIncomingCalls();
    this.peerService.myPeerId$.subscribe(peerId => {
      this.myPeerId = peerId; // get the current user's Peer ID.
    });
  }

  //sets up the local video and audio stream for the current user
  async setupLocalVideo() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (this.localVideo.nativeElement) {
        this.localVideo.nativeElement.srcObject = this.localStream;
      }
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  }

  handleIncomingCalls() {
    this.peerService.onIncomingCall().then(({ call, peerId }) => {
      this.isReceivingCall = true;
      this.incomingCallPeerId = peerId;
      this.currentCall = call;
    });
  }
// start video call to remote user
  async startCall() {
    if (!this.localStream) {
      console.error('Local stream not available');
      return;
    }
    try {
      this.currentCall = this.peerService.call(this.remotePeerId, this.localStream);
      this.handleCallStream(this.currentCall);
    } catch (err) {
      console.error('Failed to start call', err);
    }
  }

  answerCall() {
    if (this.currentCall && this.localStream) {
      this.currentCall.answer(this.localStream);
      this.handleCallStream(this.currentCall);
      this.isReceivingCall = false;
    }
  }

  rejectCall() {
    if (this.currentCall) {
      this.currentCall.close();
    }
    this.isReceivingCall = false;
    this.incomingCallPeerId = '';
  }

  handleCallStream(call: any) {
    call.on('stream', (remoteStream: MediaStream) => {
      if (this.remoteVideo.nativeElement) {
        this.remoteVideo.nativeElement.srcObject = remoteStream;
      }
    });
  }

  endCall() {
    if (this.currentCall) {
      this.currentCall.close();
    }
    this.stopLocalStream();
    this.closeVideoChat.emit();
  }

  // stop all local stream and resets video elements
  stopLocalStream() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    if (this.localVideo.nativeElement) {
      this.localVideo.nativeElement.srcObject = null;
    }
    if (this.remoteVideo.nativeElement) {
      this.remoteVideo.nativeElement.srcObject = null;
    }
  }

  ngOnDestroy() {
    this.stopLocalStream();
  }
}