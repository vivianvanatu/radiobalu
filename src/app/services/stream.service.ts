import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StreamService {
  private streamUrl = 'https://media2.streambrothers.com:2020/json/stream/8016';

  constructor(private http: HttpClient) {}

  getStreamData(): Observable<any> {
    return this.http.get<any>(this.streamUrl);
  }
}
