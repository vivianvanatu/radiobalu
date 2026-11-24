import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface StationResponse {
  song?: string;
  history?: { title: string; at: number }[];
  listeners?: number;
  connections?: number;
  listen_cdn?: string;
  listen_https?: string;
  nowplaying?: string;
  trackhistory?: string[];
  coverart?: string;
  covers?: string[];
}

export interface StreamData {
  title: string;
  cover: string;
  history: { title: string; cover?: string }[];
  listeners: number;
  listenUrl: string;
}

export const DEFAULT_COVER = 'assets/radio-balu-logo.png';
export const DEFAULT_STREAM = 'https://listen.radio.primcast.com/c/media2/281/CountryMusic';

export function normalizeStreamData(data: StationResponse): StreamData {
  const listenUrl = [data.listen_cdn, data.listen_https]
    .find(url => url?.startsWith('https://')) || DEFAULT_STREAM;

  return {
    title: data.song || data.nowplaying || 'Radio Balu',
    cover: data.coverart || DEFAULT_COVER,
    history: data.history
      ? data.history.map(track => ({ title: track.title }))
      : (data.trackhistory || []).map((title, i) => ({ title, cover: data.covers?.[i] })),
    listeners: data.listeners ?? data.connections ?? 0,
    listenUrl,
  };
}

@Injectable({
  providedIn: 'root',
})
export class StreamService {
  private streamUrl = 'https://media2.streambrothers.com:2020/json/stream/8016';

  constructor(private http: HttpClient) {}

  getStreamData(): Observable<StreamData> {
    return this.http.get<StationResponse>(this.streamUrl).pipe(map(normalizeStreamData));
  }
}
