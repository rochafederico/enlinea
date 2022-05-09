import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IArtist } from 'projects/enlinea/src/interfaces/iartist';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private baseUrl = `/artist`;
  constructor(private http: HttpClient) { }
  getAll = () => this.http.get<IArtist[]>(this.baseUrl);
  search = (text: string) =>
    this.http.get<IArtist[]>(`${this.baseUrl}/search/${text}`)
}
