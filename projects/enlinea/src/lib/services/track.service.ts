import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITrack } from 'projects/enlinea/src/interfaces/itrack';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  constructor(private http: HttpClient) { }
  getByArtistId = (artistId: string) =>
    this.http.get<ITrack[]>(`/track/artist/${artistId}`)
}
