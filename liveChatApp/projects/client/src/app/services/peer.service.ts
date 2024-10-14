import { Injectable } from '@angular/core';
import Peer from 'peerjs';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeerService {
  private peer!: Peer;
  private myPeerIdSource = new BehaviorSubject<string>('');
  myPeerId$: Observable<string> = this.myPeerIdSource.asObservable();

  constructor() {
    this.initPeer();
  }

  private initPeer() {
    this.peer = new Peer({
      host: 'localhost',
      port: 8080,
      path: '/peerjs/myapp',
      secure: false,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun.services.mozilla.com' }
        ]
      }
    });

    this.peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      this.myPeerIdSource.next(id);
    });

    this.peer.on('error', (error) => {
      console.error('PeerJS error:', error);
    });
  }

  getPeerId(): string {
    return this.peer.id;
  }

  call(remotePeerId: string, stream: MediaStream) {
    return this.peer.call(remotePeerId, stream);
  }

  answer(call: any, stream: MediaStream) {
    call.answer(stream);
    return call;
  }

  onIncomingCall() {
    return new Promise<{ call: any, peerId: string }>((resolve) => {
      this.peer.on('call', (call) => {
        resolve({ call, peerId: call.peer });
      });
    });
  }

  destroyPeer() {
    if (this.peer) {
      this.peer.destroy();
    }
  }
}