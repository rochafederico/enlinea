import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ILive } from 'projects/enlinea/src/interfaces/ilive';
import { BehaviorSubject } from 'rxjs';

// tslint:disable-next-line: no-any
declare var MediaRecorder: any;

@Injectable({
  providedIn: 'root'
})
export class LiveService {
  private liveItems: ILive[] = [];
  private subLive = new BehaviorSubject<ILive[]>([]);
  currentLive = this.subLive.asObservable();
  private mediaRecorder = {
    ondataavailable: (e: { data: BlobPart; }) => { },
    start: (timeslice: number) => { },
    pause: () => { },
    stop: () => { }
  };
  constructor(private socket: Socket) {
    this.socket.fromEvent<ILive>('live')
      .subscribe((data) => { this.setItems(data); });
    setInterval(() => {
      const now = new Date();
      const past = this.liveItems.filter(x => {
        const { schedule } = x;
        const dateSchedulre = new Date(schedule);
        dateSchedulre.setMinutes(dateSchedulre.getMinutes() + 3);
        return dateSchedulre.getTime() <= now.getTime();
      });
      if (past.length) {
        this.setItems(this.liveItems.filter(x => !past.find(y => y._id === x._id)));
      }
    }, 10000);
  }
  private setItems(data: ILive | ILive[]): void {
    if (data instanceof Array) {
      this.liveItems = [];
      for (const item of data) {
        this.liveItems.push(item);
      }
    } else {
      this.liveItems.push(data);
    }
    this.subLive.next(this.liveItems);
  }
  listen = () => this.socket.fromEvent<BlobPart>('streaming');
  addTrack(trackId: string): Promise<{ success: boolean, message: string }> {
    return new Promise<{ success: boolean, message: string }>((resolve) => {
      this.socket.emit('add-track', trackId, (data: { success: boolean, message: string }) => {
        resolve(data);
      });
    });
  }
  recordStart(): void {
    const constraints = { audio: true };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((mediaStream) => {
        this.mediaRecorder = new MediaRecorder(mediaStream);
        this.mediaRecorder.ondataavailable = (e: { data: BlobPart; }) => {
          const blob = new Blob([e.data], { type: 'audio/ogg; codecs=opus' });
          this.socket.emit('radio', blob);
        };
        this.mediaRecorder.start(1500);
      });
  }
  recordStop(): void {
    this.mediaRecorder.stop();
  }
}
