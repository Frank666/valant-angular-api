import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MazeService {
  private api = `/Maze`;
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  uploadMaze(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}${this.api}/upload-maze`, formData);
  }

  getMaze(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.api}/${id}`);
  }

  nextMove(mazeId: number, direction: string): Observable<any> {
    const url = `${this.apiUrl}${this.api}/${mazeId}/next-move`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(url, JSON.stringify(direction), { headers });
  }
}
