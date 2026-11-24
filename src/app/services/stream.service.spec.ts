import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DEFAULT_COVER, DEFAULT_STREAM, normalizeStreamData, StreamService } from './stream.service';

describe('StreamService', () => {
  let service: StreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(StreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('maps Primcast titles and history and uses a fallback cover', () => {
    service.getStreamData().subscribe(data => {
      expect(data.title).toBe('Current song');
      expect(data.history.map(track => track.title)).toEqual(['Previous song', 'Older song']);
      expect(data.cover).toBe(DEFAULT_COVER);
      expect(data.listeners).toBe(0);
      expect(data.listenUrl).toBe(DEFAULT_STREAM);
    });
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('https://media2.streambrothers.com:2020/json/stream/8016').flush({
      song: 'Current song', history: [{ title: 'Previous song', at: 1795531396 }, { title: 'Older song', at: 1795529661 }],
      listeners: 0, connections: 2, listen_cdn: DEFAULT_STREAM,
    });
    http.verify();
  });

  it('supports legacy artwork and metadata', () => {
    const data = normalizeStreamData({ nowplaying: 'Current', trackhistory: ['Previous'], coverart: 'https://example.com/current.jpg', covers: ['https://example.com/previous.jpg'], connections: 2 });
    expect(data.title).toBe('Current');
    expect(data.cover).toBe('https://example.com/current.jpg');
    expect(data.history).toEqual([{ title: 'Previous', cover: 'https://example.com/previous.jpg' }]);
    expect(data.listeners).toBe(2);
  });

  it('handles missing metadata and avoids insecure stream URLs', () => {
    expect(normalizeStreamData({})).toEqual({ title: 'Radio Balu', cover: DEFAULT_COVER, history: [], listeners: 0, listenUrl: DEFAULT_STREAM });
    expect(normalizeStreamData({ listen_cdn: 'http://example.com/live', listen_https: 'https://example.com/live' }).listenUrl).toBe('https://example.com/live');
  });
});
