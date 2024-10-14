import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:8080');
  }

  emit(eventName: string, ...args: any[]) {
    this.socket.emit(eventName, ...args);
  }

  on(eventName: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(eventName, (data: any) => observer.next(data));
    });
  }

  joinChannel(channelId: string, userId: number) {
    this.socket.emit('joinChannel', channelId, userId);
  }

  leaveChannel(channelId: string) {
    this.socket.emit('leaveChannel', channelId);
  }

  sendMessage(channelId: string, message: string, userId: number, username: string, imagePath?: string) {
    this.socket.emit('chatMessage', { channelId, message, userId, username, imagePath });
  }

  onMessage(): Observable<any> {
    return this.on('message');
  }

  onUserJoined(): Observable<{username: string, profileImage: string}> {
    return this.on('userJoined');
  }

  onUserLeft(): Observable<{username: string, profileImage: string}> {
    return this.on('userLeft');
  }

  onLoadMessages(): Observable<any[]> {
    return this.on('loadMessages');
  }
}